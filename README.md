# Disaster Welfare Platform

A centralized digital platform for transparent disaster welfare distribution. This system connects affected users, administrators, NGOs, and volunteers to streamline the process of requesting, verifying, and delivering aid.

# Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: React (Vite)
- **Database**: MongoDB (Mongoose)
- **AI Service**: Python (Flask)
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: TailwindCSS v3

# Prerequisites

- **Node.js**: v14+
- **Python**: v3.8+
- **MongoDB**: v4.4+ (Running locally on default port 27017)
- **npm** or **yarn**

# Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Madhubala972/Transparent_public_welfare_distribution.git
cd Transparent_public_welfare_distribution
```

### 2. Setup Backend
```bash
cd server
npm install
# Create .env with PORT, MONGO_URI, JWT_SECRET, AI_SERVICE_URL
npm start
```

### 3. Setup AI Service
```bash
cd ai-server
pip install -r requirements.txt
python app.py
```

### 4. Setup Frontend
```bash
cd client
npm install
npm run dev
```

# Project Structure

```text
├── ai-server/          # Python Flask service for priority AI
├── client/              # React frontend application
├── server/              # Node.js backend API
│   ├── config/          # DB connection configuration
│   ├── controllers/     # API request handlers
│   ├── middleware/      # Auth and error middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express route definitions
│   └── utils/           # Utility functions
├── design/              # UI/UX and system architecture visuals
│   └── diagrams/        # Detailed architecture and flow charts
├── docs/                # Project documentation and survey reports
├── ARCHITECTURE.md      # Core system design and ER diagrams
├── CONTRIBUTING.md      # Git Flow and PR guidelines
└── API_DOCUMENTATION.md # Backend API details
```

# API Documentation

Detailed API endpoints and request/response examples can be found in [API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md).

# Database Schema

The entity relationship diagrams and system flow are documented in [ARCHITECTURE.md](./docs/ARCHITECTURE.md#1-entity-relationship-er-diagram).

# Contributing

Please review our [Contributing Guidelines](./docs/CONTRIBUTING.md) for information on our Git Flow branching strategy and PR process.

# Performance & Trends
The platform has been optimized for high-volume data processing:
- **O(1) Aggregations**: Refactored timeline processing for sub-second dashboard loads.
- **Timezone Sync**: Integrated India Standard Time (+05:30) for accurate trend reporting.
- **Join Optimization**: Highly efficient role-based fulfillment analytics.

# License

MIT

# Contact

For any queries or support, please contact the project maintainers.
