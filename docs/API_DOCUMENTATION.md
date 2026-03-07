# API Documentation

The Disaster Welfare Platform API is built using Node.js and Express.

## Base URL
`http://localhost:5000/api`

## Authentication

### Register User
`POST /auth/register`
- **Body**: `{ "name", "email", "password", "role", "phone", "location" }`
- **Roles**: `Public`, `Volunteer`, `NGO`, `Admin`

### Login User
`POST /auth/login`
- **Body**: `{ "email", "password" }`
- **Returns**: JWT Token

---

## Help Requests

### Create Request
`POST /requests` (Protected: All Roles)
- **Body**: `{ "description", "category", "location" }`
- **AI Integration**: Automatically analyzes priority.

### Get All Requests
`GET /requests` (Protected: Admin, NGO, Volunteer)
- **Returns**: List of all help requests.

### Get My Requests
`GET /requests/my` (Protected: Public User)
- **Returns**: List of requests created by the authenticated user.

### Update Request Status
`PUT /requests/:id` (Protected: Admin, NGO, Volunteer)
- **Body**: `{ "status" }`
- **Status Options**: `Pending`, `Accepted`, `Completed`

### Get Request Details
`GET /requests/:id` (Protected: All Roles)
- **Returns**: Full details of a specific request.

---

## AI Service (Internal)
`POST http://localhost:5001/predict`
- **Body**: `{ "description" }`
- **Returns**: `{ "priority", "category" }`
