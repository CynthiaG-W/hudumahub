from extensions import db
from werkzeug.security import generate_password_hash, check_password_hash


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    saved_services = db.relationship(
        "SavedService",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email
        }


class Service(db.Model):
    __tablename__ = "services"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    address = db.Column(db.String(255))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    osm_id = db.Column(db.BigInteger)
    osm_type = db.Column(db.String(20))

    saved_by = db.relationship(
        "SavedService",
        back_populates="service",
        cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "category": self.category,
            "address": self.address,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "osm_id": self.osm_id,
            "osm_type": self.osm_type
        }


class SavedService(db.Model):
    __tablename__ = "saved_services"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    service_id = db.Column(
        db.Integer,
        db.ForeignKey("services.id"),
        nullable=False
    )

    user = db.relationship(
        "User",
        back_populates="saved_services"
    )

    service = db.relationship(
        "Service",
        back_populates="saved_by"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "service_id": self.service_id,
            "service": self.service.to_dict() if self.service else None
        }