# HudumaHub

## Find Essential Services in Nairobi

HudumaHub is a full-stack web application designed to help users find essential services across Nairobi, including hospitals, pharmacies, police stations, ATMs, and fuel stations.

The platform combines a React frontend, a Flask REST API, a PostgreSQL database, OpenStreetMap data, and an interactive Leaflet map to make service discovery more accessible and efficient.

---

## Project Overview

Finding essential services quickly can be challenging, especially in unfamiliar areas. HudumaHub centralizes this information so users can:

- Search for services in Nairobi
- Browse services by category
- View service locations on an interactive map
- Read service details from map popups and cards
- Access service addresses and coordinates
- Retrieve and manage data through a Flask API
- Store information in a PostgreSQL database

---

## Current Project Status

### Phase 1 — React Frontend

Phase 1 focused on building the frontend and integrating location-based functionality.

Implemented features:

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

Phase 2 introduced the backend API and PostgreSQL database, expanding the application to support persistent data and user-related resources.

Implemented features:

- Flask REST API
- PostgreSQL database
- SQLAlchemy ORM
- Flask-Migrate database migrations
- Database models and relationships
- Service data stored in the database
- User and saved service resources
- CRUD functionality for saved services
- Notes and favorites for saved services
- Frontend integration with the Flask API
- Database-backed application data

Current service categories:

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
```

### Technology Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React, Vite, JavaScript, HTML, CSS, Leaflet, React-Leaflet |
| Backend | Python, Flask, Flask-SQLAlchemy, Flask-Migrate, Flask-CORS, Requests |
| Database | PostgreSQL |
| External Services | OpenStreetMap, Nominatim |

---

## Core Application Resources

### Services

Services represent essential locations users can search for and view. Each service contains details such as name, category, address, and geographic coordinates.

### Users

Users represent individuals using the HudumaHub application and are associated with their own saved services.

### Saved Services

Saved services connect users to services they want to track.

Users can:

- Save a service
- View their saved services
- Add or update a personal note
- Mark a service as a favorite
- Remove a saved service

This allows users to manage their own service-related information while maintaining relationships between users and services in the database.

---

## CRUD Functionality

HudumaHub implements CRUD functionality around user-specific saved services:

| Operation | Functionality |
| --- | --- |
| Create | Save a service to a user's collection |
| Read | View saved services |
| Update | Add or update notes and favorite status |
| Delete | Remove a saved service |

The main service directory is primarily used for searching and viewing essential services.

---

## Database Models

### Service

The Service resource contains:

- id
- name
- category
- address
- latitude
- longitude
- osm_id
- osm_type

### User

The User resource contains:

- id
- username
- email
- password_hash

### SavedService

The SavedService resource connects a user to a service and can contain additional user-specific information:

- id
- user_id
- service_id
- note
- is_favorite

---

## Running the Project Locally

### Backend

1. Navigate to the backend directory:

```bash
cd backend
```

2. Activate the virtual environment:

```bash
source venv/bin/activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Apply database migrations:

```bash
flask db upgrade
```

5. Start the Flask server:

```bash
python app.py
```

### Frontend

1. Open a second terminal and navigate to the frontend:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

---

## Environment Variables

The backend uses environment variables for database configuration.

Create a `.env` file inside the backend directory:

```env
DATABASE_URL=your_postgresql_database_url
```

The `.env` file is excluded from version control using `.gitignore`.

---

## Database Migrations

The project uses Flask-Migrate and Alembic to manage database schema changes.

To apply existing migrations:

```bash
flask db upgrade
```

To create a new migration after modifying the models:

```bash
flask db migrate -m "describe your change"
```

Then apply it:

```bash
flask db upgrade
```

---

## Data Source

HudumaHub uses OpenStreetMap data through the Nominatim API for location search and service discovery.

Nominatim provides location information such as coordinates, addresses, and OpenStreetMap identifiers.

---

## Future Development

Future phases of the project will focus on:

- User authentication and secure login
- Authorization and ownership-based access control
- Enhanced user-specific features
- Improved service discovery and filtering
- Further improvements to the user experience

---

## Git Branches

The project is developed using separate branches for different phases and features.

The Phase 2 implementation focuses on the Flask backend, PostgreSQL database, database relationships, CRUD functionality, and frontend-to-backend integration.

---

## Author

Cynthia G. Wangui

HudumaHub — Full-Stack Development Project