from extensions import db


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