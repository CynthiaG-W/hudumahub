import os
import requests

from flask import Flask, request
from flask_cors import CORS
from dotenv import load_dotenv
from flask_migrate import Migrate
from services import search_locations, search_by_category
from extensions import db


load_dotenv()

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)
migrate = Migrate(app, db)

from models import Service


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


if __name__ == "__main__":
    app.run(debug=True)