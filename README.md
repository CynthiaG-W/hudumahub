# HudumaHub

## Find Essential Services in Nairobi

HudumaHub is a full-stack web application that helps users find essential services across Nairobi, including hospitals, pharmacies, police stations, ATMs, and fuel stations.

The application combines a React frontend, Flask REST API, PostgreSQL database, OpenStreetMap data, and an interactive Leaflet map to make essential services easier to discover and locate.

---

## Project Overview

Finding essential services quickly can be difficult, especially when someone is unfamiliar with an area.

HudumaHub provides a centralized platform where users can:

- Search for locations and essential services in Nairobi
- Browse services by category
- View service locations on an interactive map
- View service details through map popups and service cards
- Access service addresses and coordinates
- Retrieve and manage application data through a Flask REST API
- Store data in a PostgreSQL database

---

## Current Project Status

### Phase 1 — React Frontend

Phase 1 focused on building the frontend and integrating location-based services.

**Implemented features:**

- React + Vite frontend
- Responsive service interface
- Service category selection
- Location search
- OpenStreetMap/Nominatim integration
- Leaflet interactive map
- Service markers and popups
- Service cards
- Loading and error states

### Phase 2 — Flask Backend & Database

Phase 2 introduced the backend API and PostgreSQL database and expanded the application to support persistent data and user-related resources.

**Implemented features:**

- Flask REST API
- PostgreSQL database
- SQLAlchemy ORM
- Flask-Migrate database migrations
- Database models and relationships
- Service data stored in the database
- User and saved service resources
- CRUD functionality for saved services
- Notes and favourites for saved services
- React frontend connected to the Flask API
- Database-backed application data

**Current service categories:**

- Hospitals
- Pharmacies
- Police stations
- ATMs
- Fuel stations

---

## Application Architecture

```text
React Frontend
      │
      │ HTTP Requests
      ▼
Flask REST API
      │
      ├──────────────► Nominatim / OpenStreetMap
      │
      ▼
PostgreSQL Database
      │
      ├── Services
      ├── Users
      └── Saved Services

      Technology Stack
Frontend
React
Vite
JavaScript
HTML
CSS
Leaflet
React-Leaflet
Backend
Python
Flask
Flask-SQLAlchemy
Flask-Migrate
Flask-CORS
Requests
Database
PostgreSQL
External Services
OpenStreetMap
Nominatim
Core Application Resources
Services

Services represent essential locations that users can search for and view. Each service contains information such as its name, category, address, and geographical coordinates.

Users

Users represent individuals using the HudumaHub application and are associated with their own saved services.

Saved Services

Saved Services connect users to services they want to keep track of.

Users can:

Save a service
View their saved services
Add or update a personal note
Mark a service as a favourite
Remove a saved service

This allows users to manage their own service-related information while maintaining relationships between users and services in the database.

CRUD Functionality

HudumaHub implements CRUD functionality around user-specific saved services:

Operation	Functionality
Create	Save a service to a user's collection
Read	View saved services
Update	Add or update notes and favourite status
Delete	Remove a saved service

The main service directory is primarily used for searching and viewing essential services.

Database Models
Service

The Service resource contains:

id
name
category
address
latitude
longitude
osm_id
osm_type
User

The User resource contains:

id
username
email
password_hash
SavedService

The SavedService resource connects a user to a service and can contain additional user-specific information:

id
user_id
service_id
note
is_favorite
Running the Project Locally
Backend

Navigate to the backend directory:

cd backend

Activate the virtual environment:

source venv/bin/activate

Install dependencies:

pip install -r requirements.txt

Apply database migrations:

flask db upgrade

Start the Flask server:

python app.py
Frontend

Open a second terminal and navigate to the frontend:

cd frontend

Install dependencies:

npm install

Start the development server:

npm run dev
Environment Variables

The backend uses environment variables for database configuration.

Create a .env file inside the backend directory:

DATABASE_URL=your_postgresql_database_url

The .env file is excluded from version control using .gitignore.

Database Migrations

The project uses Flask-Migrate and Alembic to manage database schema changes.

To apply existing migrations:

flask db upgrade

To create a new migration after modifying the models:

flask db migrate -m "describe your change"

Then apply it:

flask db upgrade
Data Source

HudumaHub uses OpenStreetMap data through the Nominatim API for location search and service discovery.

Nominatim provides location information such as coordinates, addresses, and OpenStreetMap identifiers.

Future Development

Future phases of the project will focus on:

User authentication and secure login
Authorization and ownership-based access control
Enhanced user-specific features
Improved service discovery and filtering
Further improvements to the user experience
Git Branches

The project is developed using separate branches for different phases and features.

The Phase 2 implementation focuses on the Flask backend, PostgreSQL database, database relationships, CRUD functionality, and frontend-to-backend integration.

Author

Cynthia G. Wangui

HudumaHub — Full-Stack Development Project