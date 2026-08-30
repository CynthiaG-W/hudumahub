import os
import requests

from flask import Flask, request
from flask_cors import CORS
from dotenv import load_dotenv
from flask_migrate import Migrate
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity
)

from extensions import db
from models import User, Service, SavedService
from services import search_locations, search_by_category


# APP CONFIGURATION

load_dotenv()

app = Flask(__name__)

CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
    "DATABASE_URL"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = os.getenv(
    "JWT_SECRET_KEY"
)

db.init_app(app)

migrate = Migrate(app, db)

jwt = JWTManager(app)


# HOME

@app.route("/")
def home():
    return {
        "message": "Welcome to the HudumaHub API!"
    }, 200


# DATABASE TEST


@app.route("/api/db-test")
def db_test():
    try:
        db.session.execute(db.text("SELECT 1"))

        return {
            "message": "Database connection successful!"
        }, 200

    except Exception as error:
        return {
            "message": "Database connection failed",
            "error": str(error)
        }, 500


# PUBLIC SERVICES

@app.route("/api/services", methods=["GET"])
def get_services():

    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)

    page = max(page, 1)
    per_page = min(max(per_page, 1), 100)

    pagination = Service.query.paginate(
        page=page,
        per_page=per_page,
        error_out=False
    )

    return {
        "services": [
            service.to_dict()
            for service in pagination.items
        ],
        "pagination": {
            "page": pagination.page,
            "per_page": pagination.per_page,
            "total": pagination.total,
            "pages": pagination.pages,
            "has_next": pagination.has_next,
            "has_previous": pagination.has_prev
        }
    }, 200


@app.route(
    "/api/services/<int:service_id>",
    methods=["GET"]
)
def get_service(service_id):

    service = Service.query.get_or_404(service_id)

    return service.to_dict(), 200


# SEARCH

@app.route("/api/search", methods=["GET"])
def search():

    query = request.args.get("q", "").strip()

    if not query:
        return {
            "error": "Search query is required"
        }, 400

    try:
        results = search_locations(query)

        return {
            "results": results
        }, 200

    except requests.RequestException:
        return {
            "error": (
                "We couldn't complete your search "
                "right now. Please try again."
            )
        }, 503


@app.route(
    "/api/services/search",
    methods=["GET"]
)
def search_services():

    category = request.args.get(
        "category",
        ""
    ).strip()

    if not category:
        return {
            "error": "Category is required"
        }, 400

    results = search_by_category(category)

    if results is None:
        return {
            "error": "Unsupported service category"
        }, 400

    return {
        "category": category,
        "results": results
    }, 200


# AUTHENTICATION

@app.route("/api/register", methods=["POST"])
def register():

    data = request.get_json() or {}

    username = data.get(
        "username",
        ""
    ).strip()

    email = data.get(
        "email",
        ""
    ).strip().lower()

    password = data.get("password")

    if not username or not email or not password:
        return {
            "error": (
                "Username, email and password "
                "are required"
            )
        }, 400

    if User.query.filter_by(
        username=username
    ).first():

        return {
            "error": "Username already exists"
        }, 409

    if User.query.filter_by(
        email=email
    ).first():

        return {
            "error": "An account with this email already exists"
        }, 409

    user = User(
        username=username,
        email=email
    )

    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    return {
        "message": "Account created successfully",
        "user": user.to_dict()
    }, 201


@app.route("/api/login", methods=["POST"])
def login():

    data = request.get_json() or {}

    email = data.get(
        "email",
        ""
    ).strip().lower()

    password = data.get("password")

    if not email or not password:
        return {
            "error": "Email and password are required"
        }, 400

    user = User.query.filter_by(
        email=email
    ).first()

    if not user or not user.check_password(password):
        return {
            "error": "Invalid email or password"
        }, 401

    access_token = create_access_token(
        identity=str(user.id)
    )

    return {
        "message": "Login successful",
        "access_token": access_token,
        "user": user.to_dict()
    }, 200


# USER PROFILE

@app.route(
    "/api/users/<int:user_id>",
    methods=["GET"]
)
@jwt_required()
def get_user(user_id):

    current_user_id = int(
        get_jwt_identity()
    )

    if current_user_id != user_id:
        return {
            "error": "You can only access your own profile"
        }, 403

    user = User.query.get_or_404(user_id)

    return user.to_dict(), 200


@app.route(
    "/api/users/<int:user_id>",
    methods=["PUT"]
)
@jwt_required()
def update_user(user_id):

    current_user_id = int(
        get_jwt_identity()
    )

    if current_user_id != user_id:
        return {
            "error": "You can only update your own profile"
        }, 403

    user = User.query.get_or_404(user_id)

    data = request.get_json() or {}

    username = data.get(
        "username",
        ""
    ).strip()

    email = data.get(
        "email",
        ""
    ).strip().lower()

    password = data.get("password")

    if username and username != user.username:

        existing_username = User.query.filter_by(
            username=username
        ).first()

        if existing_username:
            return {
                "error": "Username already exists"
            }, 409

        user.username = username

    if email and email != user.email:

        existing_email = User.query.filter_by(
            email=email
        ).first()

        if existing_email:
            return {
                "error": (
                    "An account with this email already exists"
                )
            }, 409

        user.email = email

    if password:
        user.set_password(password)

    db.session.commit()

    return {
        "message": "Profile updated successfully",
        "user": user.to_dict()
    }, 200


# MY HUB - USER'S SAVED PLACES

@app.route(
    "/api/saved-services",
    methods=["POST"]
)
@jwt_required()
def create_saved_service():

    current_user_id = int(
        get_jwt_identity()
    )

    data = request.get_json() or {}

    # If the service already exists in our database,
    # use its existing ID.
    service_id = data.get("service_id")

    if service_id:
        service = db.session.get(
            Service,
            service_id
        )

        if not service:
            return {
                "error": "Service not found"
            }, 404

    else:
        # This is a service returned by Nominatim.
        name = data.get("name")
        category = data.get("category")

        if not name or not category:
            return {
                "error": "Service details are required"
            }, 400

        osm_id = data.get("osm_id")
        osm_type = data.get("osm_type")

        # Avoid creating duplicate OpenStreetMap services.
        service = None

        if osm_id and osm_type:
            service = Service.query.filter_by(
                osm_id=osm_id,
                osm_type=osm_type
            ).first()

        # Create the service if it doesn't already exist.
        if not service:
            service = Service(
                name=name,
                category=category,
                address=data.get("address"),
                latitude=data.get("latitude"),
                longitude=data.get("longitude"),
                osm_id=osm_id,
                osm_type=osm_type
            )

            db.session.add(service)
            db.session.flush()

    # Prevent a user from saving the same place twice.
    existing_saved_service = (
        SavedService.query.filter_by(
            user_id=current_user_id,
            service_id=service.id
        ).first()
    )

    if existing_saved_service:
        return {
            "error": "This place is already in My Hub"
        }, 409

    saved_service = SavedService(
        user_id=current_user_id,
        service_id=service.id,
        note=data.get("note"),
        is_favorite=data.get(
            "is_favorite",
            False
        )
    )

    db.session.add(saved_service)
    db.session.commit()

    return {
        "message": "Place added to My Hub",
        "saved_service": saved_service.to_dict()
    }, 201


@app.route(
    "/api/saved-services",
    methods=["GET"]
)
@jwt_required()
def get_saved_services():

    current_user_id = int(
        get_jwt_identity()
    )

    page = request.args.get(
        "page",
        1,
        type=int
    )

    per_page = request.args.get(
        "per_page",
        12,
        type=int
    )

    page = max(page, 1)
    per_page = min(max(per_page, 1), 100)

    pagination = (
        SavedService.query
        .filter_by(user_id=current_user_id)
        .order_by(SavedService.id.desc())
        .paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )
    )

    return {
        "saved_services": [
            saved_service.to_dict()
            for saved_service in pagination.items
        ],
        "pagination": {
            "page": pagination.page,
            "per_page": pagination.per_page,
            "total": pagination.total,
            "pages": pagination.pages,
            "has_next": pagination.has_next,
            "has_previous": pagination.has_prev
        }
    }, 200


@app.route(
    "/api/saved-services/<int:saved_service_id>",
    methods=["GET"]
)
@jwt_required()
def get_saved_service(saved_service_id):

    current_user_id = int(
        get_jwt_identity()
    )

    saved_service = (
        SavedService.query.filter_by(
            id=saved_service_id,
            user_id=current_user_id
        ).first_or_404()
    )

    return saved_service.to_dict(), 200


@app.route(
    "/api/saved-services/<int:saved_service_id>",
    methods=["PUT"]
)
@jwt_required()
def update_saved_service(saved_service_id):

    current_user_id = int(
        get_jwt_identity()
    )

    saved_service = (
        SavedService.query.filter_by(
            id=saved_service_id,
            user_id=current_user_id
        ).first_or_404()
    )

    data = request.get_json() or {}

    if "note" in data:
        saved_service.note = data["note"]

    if "is_favorite" in data:
        saved_service.is_favorite = bool(
            data["is_favorite"]
        )

    db.session.commit()

    return {
        "message": "Place updated successfully",
        "saved_service": saved_service.to_dict()
    }, 200


@app.route(
    "/api/saved-services/<int:saved_service_id>",
    methods=["DELETE"]
)
@jwt_required()
def delete_saved_service(saved_service_id):

    current_user_id = int(
        get_jwt_identity()
    )

    saved_service = (
        SavedService.query.filter_by(
            id=saved_service_id,
            user_id=current_user_id
        ).first_or_404()
    )

    db.session.delete(saved_service)
    db.session.commit()

    return {
        "message": "Place removed from My Hub"
    }, 200


# RUN the application


if __name__ == "__main__":
    app.run()