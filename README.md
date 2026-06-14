# Employee Management Portal

A full-stack Employee Management application featuring a secure **Python Pyramid** backend API and a modern **React** frontend dashboard. It supports full CRUD (Create, Read, Update, Delete) operations on employees, secure JWT-based user authentication, and persistent data storage in a **MySQL** database.

---

## 🏗️ Architecture & Tech Stack

This project utilizes a decoupled client-server architecture:

### Backend API
- **Framework**: [Pyramid](https://trypyramid.com/) (Python)
- **Database ORM/Connector**: [SQLAlchemy](https://www.sqlalchemy.org/) & [PyMySQL](https://github.com/PyMySQL/PyMySQL)
- **WSGI Server**: [Waitress](https://docs.pylonsproject.org/projects/waitress/)
- **Authentication**: JWT (JSON Web Tokens) with a custom auth tween (middleware)
- **Hashing**: Passlib (`custom_app_context`)

### Frontend Dashboard
- **Library**: [React](https://react.dev/) (v19)
- **Styling**: [Bootstrap 5](https://getbootstrap.com/) via [React-Bootstrap](https://react-bootstrap.github.io/)
- **Routing**: [React Router](https://reactrouter.com/) (v7)
- **Icons**: React Icons
- **HTTP Client**: Axios (configured with interceptors to attach the JWT authorization headers)

---

## 📂 Project Structure

```text
employee_api/
│
├── employee_api/             # Backend Python package
│   ├── __init__.py           # Application config, routes registration, CORS settings
│   ├── models.py             # SQLAlchemy DB schemas (User, Employee)
│   ├── views.py              # API view endpoints (login, register, CRUD)
│   └── middleware/
│       └── auth.py           # JWT Authentication tween (middleware)
│
├── employee-portal/          # Frontend React Application
│   ├── public/               # Public assets
│   ├── src/
│   │   ├── components/       # Reusable components (AddEmployeeModal, Sidebar, ProtectedRoute, etc.)
│   │   ├── pages/            # View pages (Register, Employee Dashboard)
│   │   ├── api.js            # Axios client setup with JWT auth interceptors
│   │   ├── App.js            # Frontend routing config
│   │   └── index.js          # React entrypoint
│   └── .env                  # Frontend environment variables
│
├── development.ini           # Pyramid backend environment configuration
├── initialize_db.py          # Database/tables creation script
├── requirements.txt          # Python dependencies
└── setup.py                  # Python package configuration
```

---

## 🛠️ Prerequisites

Before running this application, ensure you have the following installed on your machine:
- **Python 3.x**
- **Node.js** (v18+) & **npm**
- **MySQL Database Server** (running locally)

---

## 🚀 Setup & Installation

Follow these steps to get the full-stack application running locally:

### 1. Database Configuration & Initialization

1. Start your local MySQL database.
2. The application uses a database named `employee_db5` and connects with standard local credentials (`root`/`tiger`). To change these credentials, update them in:
   - [development.ini](file:///c:/Users/kusha/Downloads/jeff1dd/employee_api/employee_api4/employee_api/development.ini#L3)
   - [initialize_db.py](file:///c:/Users/kusha/Downloads/jeff1dd/employee_api/employee_api4/employee_api/initialize_db.py#L3-L10)
   - [employee_api/views.py](file:///c:/Users/kusha/Downloads/jeff1dd/employee_api/employee_api4/employee_api/employee_api/views.py#L14-L23)
3. Run the database initialization script to create the database schema:
   ```bash
   python initialize_db.py
   ```

### 2. Backend Setup

1. Navigate to the root directory of the project.
2. Create and activate a virtual environment:
   ```bash
   # Create a virtual environment
   python -m venv venv

   # Activate it (Windows)
   venv\Scripts\activate

   # Activate it (macOS/Linux)
   source venv/bin/activate
   ```
3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   pip install -e .
   ```
4. Start the backend development server using Waitress:
   ```bash
   pserve development.ini
   ```
   The API will be available at `http://localhost:6543`.

### 3. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd employee-portal
   ```
2. Check the `.env` configuration file to ensure it points to the correct API base URL:
   ```env
   REACT_APP_API_BASE_URL=http://localhost:6543
   ```
3. Install client dependencies:
   ```bash
   npm install
   ```
4. Start the frontend React development server:
   ```bash
   npm start
   ```
   The portal dashboard will launch in your default web browser at `http://localhost:3000`.

---

## 🔑 REST API Endpoints

All endpoints are prefixed with `/api`. Protected routes require the `Authorization` header in the format: `Authorization: JWT <token>`.

| Route | Method | Authentication | Description |
| :--- | :---: | :---: | :--- |
| `/api/register` | `POST` | Public | Register a new administrator user. |
| `/api/login` | `POST` | Public | Authenticate a user and return a JWT token. |
| `/api/logout` | `POST` | Public | Log out. |
| `/api/employees` | `GET` | Authenticated | List all employees belonging to the logged-in user. |
| `/api/employees` | `POST` | Authenticated | Create a new employee entry. |
| `/api/employees/{id}` | `PATCH` | Authenticated | Update fields (`name`, `position`, `salary`, `department`) of an employee. |
| `/api/employees/{id}` | `DELETE` | Authenticated | Remove an employee. |

---

## ✨ Features

- **JWT Authentication Flow**: Users must register and log in to manage records. The token expires in 5 minutes (configurable in `development.ini`).
- **Complete CRUD Operations**: Add, edit, list, and delete employees dynamically.
- **Role Isolation**: Users can only view, edit, or delete employees they created (based on the logged-in user's ID).
- **Responsive Dashboard**: Beautiful Sidebar navigation, Top Navbar with profile and logout status, and Bootstrap Modals for data entry.
- **Robust Database Consistency**: Queries use direct MySQL connections with `READ COMMITTED` isolation level for transaction isolation and immediate consistency.
