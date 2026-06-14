# Employee Management System

A full-stack Employee Management System developed during my internship in **June 2025**, featuring a secure **Python Pyramid** backend API and a modern **React** frontend dashboard.

The application enables secure employee record management through JWT-based authentication, user-specific data isolation, and complete CRUD (Create, Read, Update, Delete) operations backed by a MySQL database.

---

## 💼 Internship Project

This project was developed as part of my internship experience in June 2025.

### Key Learning Outcomes

* Full-stack application development
* REST API design and implementation
* JWT Authentication and Authorization
* Database schema design with SQLAlchemy
* React frontend integration
* Client-server architecture
* User-specific data access control
* Secure CRUD operations
* API testing and debugging

---

## ✨ Features

### Authentication & Security

* User Registration
* User Login & Logout
* JWT-Based Authentication
* Protected API Endpoints
* Password Hashing using Passlib
* User-Specific Employee Data Isolation

### Employee Management

* Create Employee Records
* View Employee Details
* Update Employee Information
* Delete Employee Records
* Employee Search and Management

### Dashboard Experience

* Responsive User Interface
* Sidebar Navigation
* Top Navigation Bar
* Bootstrap Modals
* Protected Routes
* Real-Time Employee Updates

### Database Management

* MySQL Database Integration
* SQLAlchemy ORM Models
* Transaction Management
* Persistent Data Storage

---

## 🏗️ System Architecture

```text
React Frontend
      │
      ▼
Axios API Client
      │
      ▼
Pyramid REST API
      │
      ▼
JWT Authentication Middleware
      │
      ▼
SQLAlchemy ORM
      │
      ▼
MySQL Database
```

---

## 🛠️ Technology Stack

### Backend

* Python
* Pyramid Framework
* SQLAlchemy
* PyMySQL
* Waitress WSGI Server
* JWT Authentication
* Passlib

### Frontend

* React
* React Router
* Axios
* Bootstrap 5
* React Bootstrap
* React Icons

### Database

* MySQL

---

## 📂 Project Structure

```text
employee_api/
│
├── employee_api/
│   ├── __init__.py
│   ├── models.py
│   ├── views.py
│   └── middleware/
│       └── auth.py
│
├── employee-portal/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api.js
│   │   ├── App.js
│   │   └── index.js
│   │
│   └── package.json
│
├── development.ini
├── initialize_db.py
├── requirements.txt
└── setup.py
```

---
## 📚 Documentation

Detailed project documentation is available in the repository:

* docs/Employee_Management_System_Documentation.pdf

The document includes:

* System Architecture
* Database Design
* API Endpoints
* Authentication Flow
* Frontend Architecture
* Development Process
* Implementation Details


## 🚀 Setup & Installation

### Prerequisites

Make sure the following are installed:

* Python 3.x
* Node.js (v18+)
* npm
* MySQL Server

---

### Step 1: Clone Repository

```bash
git clone https://github.com/Klkboss/Employee-Management-System.git
cd Employee-Management-System
```

---

### Step 2: Configure Database

Create a MySQL database:

```sql
CREATE DATABASE employee_db5;
```

Update database credentials in:

* development.ini
* initialize_db.py
* employee_api/views.py

---

### Step 3: Initialize Database

```bash
python initialize_db.py
```

---

### Step 4: Backend Setup

Create and activate virtual environment:

```bash
python -m venv venv
```

Windows:

```bash
venv\Scripts\activate
```

Linux/macOS:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
pip install -e .
```

Run backend server:

```bash
pserve development.ini
```

Backend runs at:

```text
http://localhost:6543
```

---

### Step 5: Frontend Setup

Navigate to frontend:

```bash
cd employee-portal
```

Install dependencies:

```bash
npm install
```

Create .env file:

```env
REACT_APP_API_BASE_URL=http://localhost:6543
```

Start React application:

```bash
npm start
```

Frontend runs at:

```text
http://localhost:3000
```

---

## 🔑 API Endpoints

| Endpoint            | Method | Description        |
| ------------------- | ------ | ------------------ |
| /api/register       | POST   | Register new user  |
| /api/login          | POST   | Authenticate user  |
| /api/logout         | POST   | Logout user        |
| /api/employees      | GET    | Retrieve employees |
| /api/employees      | POST   | Create employee    |
| /api/employees/{id} | PATCH  | Update employee    |
| /api/employees/{id} | DELETE | Delete employee    |

---

## 🔒 Authentication Flow

1. User registers an account.
2. User logs in with credentials.
3. Server generates a JWT token.
4. Frontend stores token securely.
5. Axios interceptor attaches token to requests.
6. Pyramid middleware validates token.
7. Protected endpoints return user-specific data.

---

## 📊 Database Models

### User

* id
* username
* password_hash

### Employee

* id
* name
* department
* position
* salary
* user_id

---

## 🎯 Project Highlights

* Developed during Internship (June 2025)
* Full-Stack Application
* Secure JWT Authentication
* RESTful API Design
* MySQL Database Integration
* React Dashboard Interface
* Role-Based Data Isolation
* Production-Style Architecture

---

## 🔮 Future Enhancements

* Role-Based Access Control (RBAC)
* Employee Profile Photos
* Attendance Management
* Payroll Management
* Performance Analytics Dashboard
* Email Notifications
* Docker Deployment
* Cloud Hosting

---

## 👨‍💻 Author

**Kushagra Chauhan**

B.Tech Computer Science Engineering

---

## 📄 License

This project is intended for educational, internship, and portfolio purposes.
