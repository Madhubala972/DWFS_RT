# Disaster Welfare Platform

A centralized digital platform for transparent disaster welfare distribution. This system connects affected users, administrators, NGOs, and volunteers to streamline the process of requesting, verifying, and delivering aid.

## Features

-   **Role-Based Access Control**:
    -   **Affected User**: Register and submit help requests for food, funds, medical aid, etc.
    -   **NGO / Volunteer**: View approved requests, assign tasks to themselves, and mark delivery status.
    -   **Administrator**: Verify users and approve requests.
-   **AI-Powered Prioritization**:
    -   Integrated AI service analyzes request descriptions to automatically assign priority (Low, Medium, High, Critical) based on urgency.
-   **Transparency**:
    -   Activity logs track all major actions (Registration, Login, Request Creation, Status Updates).
-   **Real-time Dashboard**:
    -   Status tracking from 'Pending' -> 'Approved' -> 'Assigned' -> 'Delivered'.

## Tech Stack

-   **Frontend**: React (Vite), TailwindCSS v3
-   **Backend**: Node.js, Express.js, MongoDB (Mongoose)
-   **AI Service**: Python, Flask
-   **Authentication**: JWT (JSON Web Tokens)

## Prerequisites

-   Node.js (v14+)
-   Python (v3.8+)
-   MongoDB (Running locally on default port 27017)

## Installation & Setup

### 1. Backend Setup

```bash
cd server
npm install
# Create .env file with:
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/disaster_welfare
# JWT_SECRET=your_secret_key
# AI_SERVICE_URL=http://localhost:5001/predict

npm start
```

### 2. AI Service Setup

```bash
cd ai-service
# Optional: Create virtual environment
# python -m venv venv
# source venv/bin/activate (Linux/Mac) or venv\Scripts\activate (Windows)

pip install -r requirements.txt
python app.py
```

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

## Usage

1.  Open the frontend (e.g., `http://localhost:5173`).
2.  Register a new account (Select Role: 'User', 'NGO', or 'Volunteer').
3.  **User**: Log in and click "Request Help". Fill in details. Use keywords like "urgent" or "food" to test AI prioritization.
4.  **NGO**: Log in to see the dashboard. You will see requests.
    -   'Pending' requests can be **Approved**.
    -   'Approved' requests can be **Assigned**.
    -   'Assigned' requests can be marked **Delivered**.

## Troubleshooting

-   **Tailwind CSS Error**: If you see an error about `@tailwindcss/postcss`, ensure you are using Tailwind v3. Run `npm install -D tailwindcss@3.4.17 postcss autoprefixer` in the `client` directory.
-   **MongoDB Connection**: Ensure your local MongoDB service is running.
