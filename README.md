# HudumaHub

HudumaHub is a full-stack web application for discovering essential services across Nairobi. Users can search for hospitals, pharmacies, police stations, ATMs, and fuel stations, view results on an interactive map, and save places to a personal My Hub.
## Features

- Search for locations and services in Nairobi
- Browse services by category
- View service locations on an interactive Leaflet map
- View addresses, coordinates, map markers, and service details
- Create an account and log in securely
- Save services to a personal My Hub
- Add notes to saved services
- Mark saved services as favorites
- Update or remove saved services
- Use OpenStreetMap data through the Nominatim API

## Project Status
### Phase 1: React Frontend

- React and Vite frontend
- Responsive service interface
- Service category selection
- Location search
- OpenStreetMap/Nominatim integration
- Leaflet map with markers and popups
- Service cards, loading states, and error states

### Phase 2: Flask Backend and Database
- Flask REST API
- PostgreSQL database
- SQLAlchemy ORM
- Flask-Migrate database migrations
- Database-backed service results
- Category-based service search
- Backend Nominatim integration
- OpenStreetMap identifiers stored with services
- React frontend connected to the Flask API

Current service categories:
- Hospitals
- Pharmacies
- Police stations
- ATMs
- Fuel stations

### Phase 3: Authentication and My Hub
- User registration and login
- JWT-based authentication
- Protected API endpoints
- User profile retrieval and updates
- Saved services and personal notes
- Favorite saved services
- Ownership-based access control
- Duplicate saved-service prevention
- Handling for Nominatim rate limits and external API failures

## Architecture
```text
React frontend
      |
      | HTTP requests
      v
Flask REST API
      |
      +-------------> Nominatim / OpenStreetMap
      |
      v
PostgreSQL database
      |
      +-- Users
      +-- Services
      +-- Saved services

```

The React frontend communicates with the Flask REST API. Flask handles authentication, service requests, user-specific saved services, and database operations. PostgreSQL stores persistent application data, while Nominatim provides location and service discovery.

## Technology Stack

| Area | Technologies |
| --- | --- |
| Frontend | React, Vite, JavaScript, HTML, CSS, Leaflet, React-Leaflet |
| Backend | Python, Flask, Flask-SQLAlchemy, Flask-Migrate, Flask-CORS, Flask-JWT-Extended, Requests, python-dotenv |
| Database | PostgreSQL |
| External services | OpenStreetMap, Nominatim |

## Backend API

The API runs locally at `http://127.0.0.1:5000`.

### Public endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/` | Returns the API welcome message. |
| `GET` | `/api/db-test` | Tests the PostgreSQL connection. |
| `GET` | `/api/services` | Returns database services with pagination. |
| `GET` | `/api/services/<service_id>` | Returns one database service. |
| `GET` | `/api/search?q=<query>` | Searches locations through Nominatim. |
| `GET` | `/api/services/search?category=<category>` | Searches services by category through Nominatim. |

Pagination is supported by the service endpoints with `page` and `per_page` query parameters. For example: `/api/services?page=1&per_page=10`.

### Authentication endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/register` | Creates a user account. |
| `POST` | `/api/login` | Authenticates a user and returns a JWT access token. |

### Protected endpoints

Protected endpoints require an access token in the request header:

```text
Authorization: Bearer <access_token>
```

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/users/<user_id>` | Returns the authenticated user's profile. |
| `PUT` | `/api/users/<user_id>` | Updates the authenticated user's profile. |
| `POST` | `/api/saved-services` | Saves a service to My Hub. |
| `GET` | `/api/saved-services` | Returns the authenticated user's saved services. |
| `GET` | `/api/saved-services/<saved_service_id>` | Returns one saved service. |
| `PUT` | `/api/saved-services/<saved_service_id>` | Updates a saved service's note or favorite status. |
| `DELETE` | `/api/saved-services/<saved_service_id>` | Removes a service from My Hub. |

Saved-service results support pagination with `page` and `per_page`. The default page size is 12, and the maximum is 100.

## Running Locally

### Prerequisites

- Python 3
- Node.js and npm
- PostgreSQL

### 1. Configure the backend

From the project root, create and activate a virtual environment, then install the backend dependencies:

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create `backend/.env` with your PostgreSQL connection string and JWT secret:

```dotenv
DATABASE_URL=your_postgresql_database_url
JWT_SECRET_KEY=your_secret_key
```

### 2. Apply database migrations

From the `backend` directory, run:

```bash
flask db upgrade
```

After changing the SQLAlchemy models, create and apply a migration:

```bash
flask db migrate -m "describe your change"
flask db upgrade
```

### 3. Start the backend

```bash
python app.py
```

### 4. Start the frontend

Open a second terminal from the project root:

```bash
cd frontend
npm install
npm run dev
```

The frontend is normally available at `http://localhost:5173`.

Useful frontend commands:

```bash
npm run lint
npm run build
npm run preview
```

## Project Structure

```text
hudumahub/
├── backend/
│   ├── app.py
│   ├── extensions.py
│   ├── models.py
│   ├── services.py
│   ├── migrations/
│   └── requirements.txt
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── auth/
│       │   └── layout/
│       ├── pages/
│       ├── services/
│       ├── App.jsx
│       ├── App.css
│       └── index.css
└── README.md
```

## Data Source and Error Handling

HudumaHub uses OpenStreetMap data through the Nominatim API for location search and service discovery. Nominatim provides location information, coordinates, addresses, and OpenStreetMap identifiers.

Because Nominatim is an external service with usage and rate limits, the backend returns controlled error responses for missing queries, unsupported categories, rate limiting, and temporary external-service failures. The API also handles invalid credentials, duplicate accounts, unauthorized access, missing services, and duplicate saved services.

## MVP Scope

The current MVP includes:

- Essential service discovery
- Category-based search
- Location information
- Interactive map
- Service details
- User registration and login
- JWT authentication
- Personal My Hub
- Saved services, notes, and favorites

## Future Development

Potential improvements include:

- Email verification and password reset
- Improved service verification
- User reports for incorrect or outdated information
- Additional service categories and richer service details
- Improved search and filtering
- More comprehensive user feedback
- Performance and caching improvements
- Expansion beyond Nairobi

## Git Branches

The project uses separate branches for different phases and features. The current Phase 3 implementation is available on `phase-3-auth`.

## Author

Cynthia G. Wangui

HudumaHub: Full-Stack Development Project
# HudumaHub

## Find Essential Services in Nairobi

HudumaHub is a full-stack web application that helps users find essential services across Nairobi, including hospitals, pharmacies, police stations, ATMs, and fuel stations.

The application combines a React frontend, Flask REST API, PostgreSQL database, OpenStreetMap data, and an interactive Leaflet map to make essential services easier to discover and locate.

---

## Project Overview

Finding essential services quickly can be difficult, especially when someone is unfamiliar with an area.

HudumaHub provides a centralized platform where users can:

- Search for locations and services in Nairobi
- Browse services by category
- View service locations on an interactive map
- View service details through map popups and service cards
- Access service addresses and coordinates
- Retrieve service data through a Flask REST API
- Create an account and log in securely
- Save services to a personal My Hub
- Add notes to saved services
- Mark saved services as favorites
- Update and remove saved services

---

## Project Status

### Phase 1 — React Frontend

Phase 1 focused on building the frontend and integrating location-based services.

Implemented features:

- React + Vite frontend
- Responsive service interface
- Service category selection
- Location search
- OpenStreetMap/Nominatim integration
- Leaflet interactive map
- Service markers
- Marker popups
- Service cards
- Loading states
- Error states

### Phase 2 — Flask Backend & Database

Phase 2 introduced the backend API and PostgreSQL database.

Implemented features:

- Flask REST API
- PostgreSQL database
- SQLAlchemy ORM
- Flask-Migrate database migrations
- Service model
- Database-backed service results
- Category-based service search
- Nominatim integration through the backend
- OpenStreetMap identifiers stored with services
- React frontend connected to the Flask API

Current service categories:

- Hospitals
- Pharmacies
- Police stations
- ATMs
- Fuel stations

### Phase 3 — Authentication & My Hub

Phase 3 introduced user authentication and user-specific saved services.

Implemented features:

- User registration
- User login
- JWT-based authentication
- Protected API endpoints
- User profile retrieval
- User profile updates
- Save services to My Hub
- View saved services
- View individual saved services
- Add notes to saved services
- Mark saved services as favorites
- Update saved services
- Delete saved services
- Ownership-based access control
- Prevention of duplicate saved services
- Handling of Nominatim rate limiting and external API errors

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
      ├── Users
      ├── Services
      └── Saved Services

The React frontend communicates with the Flask REST API.

Flask handles authentication, service requests, user-specific saved services, and database operations.

Nominatim is used for location and service discovery.

PostgreSQL stores persistent application data including users, services, and saved services.

JWT is used to authenticate users when accessing protected endpoints.

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
Flask-JWT-Extended
Requests
python-dotenv
Database
PostgreSQL
External Services
OpenStreetMap
Nominatim

Backend API
Health / Welcome
GET /

Returns a welcome message from the API.
Database Test
GET /api/db-test

Tests the connection between Flask and PostgreSQL.

Get Services
GET /api/services

Returns services stored in the database.

Supports pagination using:

?page=1&per_page=10
Get One Service
GET /api/services/<service_id>

Returns a specific service.
Search Locations
get_jwt_identity()

This allows the application to enforce ownership rules.

For example, when accessing a saved service, the backend checks both the saved service ID and the authenticated user's ID.

This ensures that one user cannot access or modify another user's saved services.

Error Handling

HudumaHub handles common API errors and external service failures.

Examples include:

Missing search queries
Missing service categories
Invalid login credentials
Duplicate usernames
Duplicate email addresses
Unauthorized access
Service not found
Duplicate saved services
Nominatim rate limiting
External service request failures

When Nominatim rate-limits HudumaHub, the application returns a controlled error response instead of allowing the exception to result in an unhandled server error.

Running the Project Locally
Backend

Navigate to the backend directory:

cd backend

Activate the virtual environment:

source venv/bin/activate

Start the Flask server:

python app.py

The API runs locally at:

http://127.0.0.1:5000
Frontend

Open a second terminal and navigate to the frontend:

cd frontend

Install dependencies:

npm install

Start the development server:

npm run dev

The frontend will normally be available at:

http://localhost:5173

Environment Variables

The backend uses environment variables for configuration.

Create a .env file inside the backend directory:

DATABASE_URL=your_postgresql_database_url
JWT_SECRET_KEY=your_secret_key

The .env file should be excluded from version control using .gitignore.

Database Migrations

The project uses Flask-Migrate/Alembic to manage database schema changes.

To apply existing migrations:

flask db upgrade

To create a new migration after modifying the models:

flask db migrate -m "describe your change"

Then apply it:

flask db upgrade

Project Structure
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

Data Source

HudumaHub uses OpenStreetMap data through the Nominatim API for location search and service discovery.

Nominatim provides location information, coordinates, addresses, and OpenStreetMap identifiers.

Because Nominatim is an external service with usage and rate limits, HudumaHub includes error handling for situations where the service is temporarily unavailable or rate-limits requests.

MVP Scope

The Minimum Viable Product (MVP) focuses on the core functionality needed to help users discover and save essential services.

The current MVP includes:

Essential service discovery
Category-based search
Location information
Interactive map
Service details
User registration
User login
JWT authentication
Personal My Hub
Saved services
Notes and favorites

The project can be extended based on user feedback and further research.

Future Development

Potential future improvements include:

Email verification
Password reset functionality
Improved service verification
User reporting of incorrect or outdated service information
Additional service categories
More detailed service information
Improved search and filtering
More comprehensive user feedback features
Additional performance and caching improvements
Expansion beyond Nairobi

Git Branches

The project is developed using separate branches for different phases and features.

The current Phase 3 implementation is available on:

phase-3-auth

The Phase 3 implementation includes authentication, JWT authorization, user profiles, saved services, My Hub functionality, and the existing Flask/PostgreSQL service functionality.

Author

Cynthia G. Wangui

HudumaHub — Full-Stack Development Project