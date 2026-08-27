# HudumaHub

## Find Essential Services in Nairobi

HudumaHub is a full-stack web application that helps users find essential services across Nairobi, including hospitals, pharmacies, police stations, ATMs, and fuel stations.

The application combines a React frontend, Flask REST API, PostgreSQL database, OpenStreetMap data, and an interactive Leaflet map to make essential services easier to discover and locate.

---

## Project Overview

Finding essential services quickly can be difficult, especially when someone is unfamiliar with an area.

HudumaHub provides a centralized platform where users can:

* Search for locations and services in Nairobi
* Browse services by category
* View service locations on an interactive map
* View service details through map popups and service cards
* Access service addresses and coordinates
* Retrieve service data through a Flask REST API
* Store service information in a PostgreSQL database

---

## Current Project Status

### Phase 1 — React Frontend

Phase 1 focused on building the frontend and integrating location-based services.

Implemented features:

* React + Vite frontend
* Responsive service interface
* Service category selection
* Location search
* OpenStreetMap/Nominatim integration
* Leaflet interactive map
* Service markers
* Marker popups
* Service cards
* Loading and error states

### Phase 2 — Flask Backend & Database

Phase 2 introduced the backend API and PostgreSQL database.

Implemented features:

* Flask REST API
* PostgreSQL database
* SQLAlchemy ORM
* Flask-Migrate database migrations
* Service model
* CRUD endpoints for services
* Category-based service search
* Nominatim integration through the backend
* OpenStreetMap identifiers stored with services
* React frontend connected to the Flask API
* Database-backed service results

Current service categories:

* Hospitals
* Pharmacies
* Police stations
* ATMs
* Fuel stations

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
      ▼
Service Data
```

The React frontend communicates with the Flask API, while Flask manages service data and database operations. Location information is retrieved using OpenStreetMap's Nominatim service.

---

## Technology Stack

### Frontend

* React
* Vite
* JavaScript
* HTML
* CSS
* Leaflet
* React-Leaflet

### Backend

* Python
* Flask
* Flask-SQLAlchemy
* Flask-Migrate
* Flask-CORS
* Requests

### Database

* PostgreSQL

### External Services

* OpenStreetMap
* Nominatim

---

## Backend API

### Health / Welcome

```text
GET /
```

Returns a welcome message from the API.

### Database Test

```text
GET /api/db-test
```

Tests the connection between Flask and PostgreSQL.

### Get All Services

```text
GET /api/services
```

Returns all services stored in the database.

### Get One Service

```text
GET /api/services/<service_id>
```

Returns a specific service.

### Create a Service

```text
POST /api/services
```

Creates a new service.

Example request:

```json
{
  "name": "Example Hospital",
  "category": "hospital",
  "address": "Nairobi, Kenya",
  "latitude": -1.286389,
  "longitude": 36.817223
}
```

### Update a Service

```text
PUT /api/services/<service_id>
```

Updates an existing service.

### Delete a Service

```text
DELETE /api/services/<service_id>
```

Deletes an existing service.

### Search Locations

```text
GET /api/search?q=<query>
```

Searches for locations using Nominatim.

### Search Services by Category

```text
GET /api/services/search?category=<category>
```

Returns services stored in the database for a supported category.

Supported categories:

```text
hospital
pharmacy
police
atm
fuel
```

---

## Database Model

The main `Service` resource contains:

```text
id
name
category
address
latitude
longitude
osm_id
osm_type
```

OpenStreetMap identifiers are stored to help identify services originating from OpenStreetMap and reduce duplicate records when importing service data.

---

## Running the Project Locally

### Backend

Navigate to the backend directory:

```bash
cd backend
```

Activate the virtual environment:

```bash
source venv/bin/activate
```

Start the Flask server:

```bash
python app.py
```

The API runs locally at:

```text
http://127.0.0.1:5000
```

### Frontend

Open a second terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

## Environment Variables

The backend uses environment variables for database configuration.

Create a `.env` file inside the `backend` directory:

```text
DATABASE_URL=your_postgresql_database_url
```

The `.env` file is excluded from version control using `.gitignore`.

---

## Database Migrations

The project uses Flask-Migrate/Alembic to manage database schema changes.

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

## Project Structure

```text
hudumahub/
│
├── backend/
│   ├── app.py
│   ├── extensions.py
│   ├── models.py
│   ├── services.py
│   ├── migrations/
│   ├── .env
│   └── .gitignore
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── services/
│       ├── App.jsx
│       ├── App.css
│       └── index.css
│
└── README.md
```

---

## Data Source

HudumaHub uses OpenStreetMap data through the Nominatim API for location search and service discovery.

Nominatim is used to retrieve location information, coordinates, addresses, and OpenStreetMap identifiers.

---

## Future Development

Future phases of the project will focus on:

* User authentication
* Authorization and ownership-based access control
* User-specific data
* Additional relational resources
* Full CRUD functionality for additional resources
* Improved service discovery
* Potential deployment of the full-stack application

---

## Git Branches

The project is developed using separate branches for different phases and features.

The current Phase 2 implementation is available on:

```text
phase-2-backend
```

The Phase 2 implementation includes the Flask backend, PostgreSQL integration, database migrations, service APIs, and frontend-to-backend integration.

---

## Author

**Cynthia G. Wangui**

HudumaHub — Full-Stack Development Project



