# Enterprise Authentication Module

A highly reusable, production-ready, and lightweight Authentication and Authorization Module designed for Node.js, Express, and MongoDB.

This module is designed to be easily showcased and integrated as a reusable enterprise component inside a Module Library Platform. It provides robust user authentication using JSON Web Tokens (JWT), secure password hashing using `bcryptjs`, and clean Role-Based Access Control (RBAC).

---

## Features

- **User Registration**: Create accounts with automatic password hashing.
- **User Login**: Authenticate users, compare secure passwords, and issue signed JWTs.
- **Role-Based Access Control (RBAC)**: Support for distinct user roles (`Admin` and `Developer`).
- **Protected Routes & RBAC Middleware**: Simple middleware hooks to secure API endpoints.
- **Database Hooking**: Uses Mongoose pre-save middleware hooks for password encryption.
- **Modularity**: Fully decoupled structures so you can easily drop the folder structure into any Express application.

---

## Tech Stack

- **Runtime Environment**: Node.js
- **Framework**: Express.js
- **Database Object Modeling**: Mongoose (MongoDB)
- **Token-Based Authentication**: jsonwebtoken (JWT)
- **Hashing**: bcryptjs
- **Environment Management**: dotenv

---

## Repository Structure

```text
├── config/
│   └── db.js                 # MongoDB connection setup
├── controllers/
│   └── authController.js     # Business logic for Registration, Login, and Profile
├── middleware/
│   └── authMiddleware.js     # JWT verification and role authorization middleware
├── models/
│   └── User.js               # Mongoose User model with password hashing hooks
├── routes/
│   └── authRoutes.js         # Express routing definitions for auth routes
├── .env.example              # Sample environment configuration template
├── package.json              # Project dependencies and script runner configurations
├── README.md                 # Module documentation
└── server.js                 # Entry point of the Express server
```

---

## Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local installation or MongoDB Atlas cloud cluster)

### 1. Clone & Install Dependencies
Navigate into the directory and install dependencies:
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to a new file named `.env`:
```bash
cp .env.example .env
```
Open `.env` and fill in your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/enterprise_auth
JWT_SECRET=your_super_secret_jwt_signing_key_change_in_production
JWT_EXPIRES_IN=1d
```

### 3. Run the Server
**Development Mode (auto-reload via nodemon):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

---

## API Endpoints

### 1. Register User
Creates a new user account and returns a JWT token.
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Body Parameter Options**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "securepassword123",
    "role": "Developer" 
  }
  ```
  *(Note: `role` defaults to `Developer` if not provided. Supported roles: `Developer`, `Admin`)*
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "648f3b...",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "Developer"
    }
  }
  ```

### 2. Login User
Authenticates a user and issues a JWT token.
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Body Parameters**:
  ```json
  {
    "email": "jane@example.com",
    "password": "securepassword123"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Logged in successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "648f3b...",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "Developer"
    }
  }
  ```

### 3. Get User Profile (Protected)
Retrieves profile of the authenticated user using JWT token.
- **URL**: `/api/auth/profile`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <your_jwt_token>`
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "user": {
      "_id": "648f3b...",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "Developer",
      "createdAt": "2026-07-06T13:00:00.000Z",
      "updatedAt": "2026-07-06T13:00:00.000Z"
    }
  }
  ```

### 4. Admin Dashboard (Protected - Admin Only)
Demonstrates role authorization restriction.
- **URL**: `/api/auth/admin-dashboard`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <your_jwt_token_for_admin_user>`
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Welcome to the Admin Dashboard! Access granted.",
    "user": { ... }
  }
  ```
- **Error Response (403 Forbidden)**:
  ```json
  {
    "success": false,
    "message": "User role 'Developer' is not authorized to access this resource"
  }
  ```

---

## Modularity & Reusability Guide

To reuse this module in another project:
1. Copy the `config/`, `controllers/`, `middleware/`, `models/`, and `routes/` folders into your target codebase.
2. Ensure you have installed the required dependencies:
   ```bash
   npm install express mongoose jsonwebtoken bcryptjs dotenv
   ```
3. Mount the auth router in your main Express entry file:
   ```javascript
   const authRoutes = require('./routes/authRoutes');
   app.use('/api/auth', authRoutes);
   ```
4. Define `MONGODB_URI` and `JWT_SECRET` variables in your target environment config (`.env`).
