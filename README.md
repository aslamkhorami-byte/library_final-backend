# Library Website Backend (Node.js + Express + MongoDB)

A simple **Library Backend API** built with **Node.js**, **Express**, **MongoDB (Mongoose)**, **JWT Authentication**, and **bcrypt** password hashing.

This project includes:
- User registration & login (JWT)
- Protected user profile endpoints
- Full CRUD for Books (create, read, update, delete)
- Ownership-based access control (each user only accesses their own books)

---

## Table of Contents
- [Tech Stack](#tech-stack)
- [Project Features](#project-features)
- [Folder Structure](#folder-structure)
- [Step-by-step Setup](#step-by-step-setup)
- [Environment Variables](#environment-variables)
- [Run the Project](#run-the-project)
- [API Endpoints](#api-endpoints)
- [Step-by-step Testing in Apidog / Postman](#step-by-step-testing-in-apidog--postman)
- [Screenshot Naming](#screenshot-naming)
- [Common Errors & Fixes](#common-errors--fixes)
- [Submission Checklist](#submission-checklist)

---

## Tech Stack
- **Node.js**
- **Express**
- **MongoDB** + **Mongoose**
- **JWT** (jsonwebtoken)
- **bcryptjs**
- **dotenv**
- **nodemon** (dev)

---

## Project Features
### Authentication
- Register new users
- Login users and return JWT token
- Hash passwords with bcrypt (never store plain password)

### User
- Get profile (protected)
- Update profile (protected)

### Books (Resource)
- Create book (protected)
- Get all my books (protected)
- Get book by id (protected)
- Update book (protected)
- Delete book (protected)
- Each book has an `owner` (userId). Users can access **only their own books**.

---

## Folder Structure
Typical structure (your project may look very close to this):

```
library-backend/
│  server.js
│  package.json
│  .env
└─ src/
   ├─ app.js
   ├─ config/
   │  └─ db.js
   ├─ controllers/
   │  ├─ authController.js
   │  ├─ userController.js
   │  └─ bookController.js
   ├─ middleware/
   │  └─ authMiddleware.js
   ├─ models/
   │  ├─ User.js
   │  └─ Book.js
   └─ routes/
      ├─ authRoutes.js
      ├─ userRoutes.js
      └─ resourceRoutes.js
```

---

## Step-by-step Setup

### 1) Create a new Node project
```bash
npm init -y
```

### 2) Install dependencies
```bash
npm i express mongoose dotenv bcryptjs jsonwebtoken joi
npm i -D nodemon
```

### 3) Add scripts to `package.json`
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

### 4) Create `.env`
Create a file named `.env` in the root directory:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/library_backend
JWT_SECRET=super_secret_key_change_me
```

### 5) Make sure MongoDB is running
If MongoDB is installed locally, start it (depends on your OS).  
Then the app will connect using the `MONGO_URI`.

---

## Environment Variables
| Variable | Example | Description |
|---|---|---|
| `PORT` | `3000` | Server port |
| `MONGO_URI` | `mongodb://127.0.0.1:27017/library_backend` | MongoDB connection string |
| `JWT_SECRET` | `super_secret_key_change_me` | Secret key used to sign JWT tokens |

---

## Run the Project

### Development (recommended)
```bash
npm run dev
```

### Production
```bash
npm start
```

### Health Check
Open in browser:
```
http://localhost:3000/
```
Expected response:
```
Library Backend is running 
```

---

## API Endpoints

> **Base URL**
```
http://localhost:3000
```

### Auth
#### 1) Register
- **POST** `/api/auth/register`

Body (JSON):
```json
{
  "username": "aslam",
  "email": "aslam@test.com",
  "password": "123456"
}
```

Success response:
```json
{
  "message": "User registered successfully"
}
```

#### 2) Login
- **POST** `/api/auth/login`

Body (JSON):
```json
{
  "email": "aslam@test.com",
  "password": "123456"
}
```

Success response (example):
```json
{
  "message": "Logged in successfully",
  "token": "YOUR_JWT_TOKEN",
  "user": {
    "id": "USER_ID",
    "username": "aslam",
    "email": "aslam@test.com"
  }
}
```

---

### User (Protected)
> These endpoints require **Authorization header**:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

#### 3) Get Profile
- **GET** `/api/users/profile`

Success response:
```json
{
  "id": "USER_ID",
  "username": "aslam",
  "email": "aslam@test.com",
  "createdAt": "..."
}
```

#### 4) Update Profile
- **PUT** `/api/users/profile`

Body (JSON) examples:
```json
{ "username": "aslam_new" }
```

Success response:
```json
{
  "message": "Profile updated",
  "user": {
    "id": "USER_ID",
    "username": "aslam_new",
    "email": "aslam@test.com"
  }
}
```

---

### Books (Resource) (Protected)
> These endpoints require **Authorization header**:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

#### 5) Create Book
- **POST** `/api/resource`

Body (JSON):
```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "category": "Programming",
  "available": true
}
```

Success response:
```json
{
  "message": "Book created",
  "book": {
    "_id": "BOOK_ID",
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "category": "Programming",
    "available": true,
    "owner": "USER_ID",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

#### 6) Get All My Books
- **GET** `/api/resource`

Success response:
```json
{
  "count": 1,
  "books": [
    {
      "_id": "BOOK_ID",
      "title": "Clean Code",
      "author": "Robert C. Martin",
      "category": "Programming",
      "available": true,
      "owner": "USER_ID",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

#### 7) Get Book By ID
- **GET** `/api/resource/:id`

Example:
```
GET /api/resource/BOOK_ID
```

#### 8) Update Book
- **PUT** `/api/resource/:id`

Body example:
```json
{ "available": false }
```

Success response:
```json
{
  "message": "Book updated",
  "book": {
    "_id": "BOOK_ID",
    "available": false
  }
}
```

#### 9) Delete Book
- **DELETE** `/api/resource/:id`

Success response:
```json
{
  "message": "Book deleted"
}
```

---

## Step-by-step Testing in Apidog / Postman

### Step A — Register
1. Create a request: **POST** `http://localhost:3000/api/auth/register`
2. Body → JSON → send `username`, `email`, `password`
3. Send and confirm success

### Step B — Login and Copy Token
1. **POST** `http://localhost:3000/api/auth/login`
2. Body → JSON → send `email`, `password`
3. Copy the `token` from the response

### Step C — Set Authorization Header
For protected endpoints add this header:
- Key: `Authorization`
- Value:
```
Bearer YOUR_JWT_TOKEN
```

### Step D — Test Profile
1. **GET** `/api/users/profile` (should return user data)
2. **PUT** `/api/users/profile` (update username and confirm response)

### Step E — Test Books CRUD
1. **POST** `/api/resource` → create book (save `BOOK_ID`)
2. **GET** `/api/resource` → list all books
3. **GET** `/api/resource/BOOK_ID` → get single book
4. **PUT** `/api/resource/BOOK_ID` → update (e.g., `available: false`)
5. **DELETE** `/api/resource/BOOK_ID` → delete

---

## Screenshot Naming
Use clear numbering so the teacher understands the order:

```
01-auth-register.png
02-auth-login-success.png
03-user-get-profile.png
04-user-update-profile.png
05-book-create.png
06-book-get-all.png
07-book-get-by-id.png
08-book-update.png
09-book-delete.png
```

---

## Common Errors & Fixes

### 1) “Not authorized, token failed”
Fix: Make sure header is exactly:
```
Authorization: Bearer <TOKEN>
```
- Include the word `Bearer`
- One space after it
- Token must be the real JWT token (not `YOUR_TOKEN`)

### 2) “TypeError: argument handler must be a function”
Fix:
- Check your imports in routes
- Ensure controller functions are exported correctly
- Ensure `protect` middleware is exported and imported properly

### 3) MongoDB connection fails
Fix:
- Confirm MongoDB service is running
- Check `MONGO_URI` in `.env`
- Restart server after changing `.env`

---

## Submission Checklist
- API endpoints working
- All protected routes require JWT
- MongoDB connected
- Screenshots taken and named correctly
- `.env` included **only if teacher allows** (otherwise remove secrets and explain in README)
- Project runs on port **3000**
- Zip / GitHub is clean (no extra files)

---

## Author
- Mohammad Aslam Khorami
- Library Website Backend
