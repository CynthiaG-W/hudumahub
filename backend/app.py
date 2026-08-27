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

from services import search_locations, search_by_category
from extensions import db
from models import User, Service, SavedService

load_dotenv()

app = Flask(__name__)

CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")


db.init_app(app)

migrate = Migrate(app, db)

jwt = JWTManager(app)


@app.route("/")
def home():
    return {
        "message": "Welcome to the HudumaHub API!"
    }


@app.route("/api/db-test")
def db_test():
    try:
        db.session.execute(db.text("SELECT 1"))

        return {
            "message": "Database connection successful!"
        }

    except Exception as e:
        return {
            "message": "Database connection failed",
            "error": str(e)
        }, 500


# GET all services
@app.route("/api/services")
def get_services():
    services = Service.query.all()

    return {
        "services": [service.to_dict() for service in services]
    }


# GET one service
@app.route("/api/services/<int:service_id>")
def get_service(service_id):
    service = Service.query.get_or_404(service_id)

    return service.to_dict()


# CREATE a service
@app.route("/api/services", methods=["POST"])
def create_service():
    data = request.get_json()

    service = Service(
        name=data["name"],
        category=data["category"],
        address=data.get("address"),
        latitude=data.get("latitude"),
        longitude=data.get("longitude")
    )

    db.session.add(service)
    db.session.commit()

    return service.to_dict(), 201


# UPDATE a service
@app.route("/api/services/<int:service_id>", methods=["PUT"])
def update_service(service_id):
    service = Service.query.get_or_404(service_id)

    data = request.get_json()

    service.name = data.get("name", service.name)
    service.category = data.get("category", service.category)
    service.address = data.get("address", service.address)
    service.latitude = data.get("latitude", service.latitude)
    service.longitude = data.get("longitude", service.longitude)

    db.session.commit()

    return service.to_dict()


# DELETE a service
@app.route("/api/services/<int:service_id>", methods=["DELETE"])
def delete_service(service_id):
    service = Service.query.get_or_404(service_id)

    db.session.delete(service)
    db.session.commit()

    return {
        "message": "Service deleted successfully"
    }


# Search Nominatim
@app.route("/api/search")
def search():
    query = request.args.get("q")

    if not query:
        return {
            "error": "Search query is required"
        }, 400

    try:
        results = search_locations(query)

        return {
            "results": results
        }

    except requests.RequestException as e:
        return {
            "error": "Nominatim request failed",
            "details": str(e)
        }, 500


# Search by HudumaHub category
@app.route("/api/services/search")
def search_services():
    category = request.args.get("category")

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
    }


# Register a new user
@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return {
            "error": "Username, email and password are required"
        }, 400

    if User.query.filter_by(username=username).first():
        return {
            "error": "Username already exists"
        }, 409

    if User.query.filter_by(email=email).first():
        return {
            "error": "Email already exists"
        }, 409

    user = User(
        username=username,
        email=email
    )

    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    return {
        "message": "User registered successfully",
        "user": user.to_dict()
    }, 201


# Login
@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return {
            "error": "Email and password are required"
        }, 400

    user = User.query.filter_by(email=email).first()

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

# CREATE a saved service
@app.route("/api/saved-services", methods=["POST"])
@jwt_required()
def create_saved_service():
    current_user_id = int(get_jwt_identity())

    data = request.get_json()

    service_id = data.get("service_id")

    if not service_id:
        return {
            "error": "service_id is required"
        }, 400

    service = Service.query.get(service_id)

    if not service:
        return {
            "error": "Service not found"
        }, 404

    existing = SavedService.query.filter_by(
        user_id=current_user_id,
        service_id=service_id
    ).first()

    if existing:
        return {
            "error": "Service already saved"
        }, 409

    saved_service = SavedService(
        user_id=current_user_id,
        service_id=service_id
    )

    db.session.add(saved_service)
    db.session.commit()

    return saved_service.to_dict(), 201


# GET current user's saved services
@app.route("/api/saved-services", methods=["GET"])
@jwt_required()
def get_saved_services():
    current_user_id = int(get_jwt_identity())

    saved_services = SavedService.query.filter_by(
        user_id=current_user_id
    ).all()

    return {
        "saved_services": [
            saved_service.to_dict()
            for saved_service in saved_services
        ]
    }


# GET one saved service
@app.route("/api/saved-services/<int:saved_service_id>", methods=["GET"])
@jwt_required()
def get_saved_service(saved_service_id):
    current_user_id = int(get_jwt_identity())

    saved_service = SavedService.query.filter_by(
        id=saved_service_id,
        user_id=current_user_id
    ).first_or_404()

    return saved_service.to_dict()


# UPDATE a saved service
@app.route("/api/saved-services/<int:saved_service_id>", methods=["PUT"])
@jwt_required()
def update_saved_service(saved_service_id):
    current_user_id = int(get_jwt_identity())

    saved_service = SavedService.query.filter_by(
        id=saved_service_id,
        user_id=current_user_id
    ).first_or_404()

    data = request.get_json()

    service_id = data.get("service_id")

    if service_id:
        service = Service.query.get(service_id)

        if not service:
            return {
                "error": "Service not found"
            }, 404

        saved_service.service_id = service_id

    db.session.commit()

    return saved_service.to_dict()


# DELETE a saved service
@app.route("/api/saved-services/<int:saved_service_id>", methods=["DELETE"])
@jwt_required()
def delete_saved_service(saved_service_id):
    current_user_id = int(get_jwt_identity())

    saved_service = SavedService.query.filter_by(
        id=saved_service_id,
        user_id=current_user_id
    ).first_or_404()

    db.session.delete(saved_service)
    db.session.commit()

    return {
        "message": "Saved service deleted successfully"
    }

if __name__ == "__main__":
    app.run(debug=True)
