const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Load environment variables
dotenv.config();

// Important: Move current directory to root relative context for imports to work
const connectDB = require('../server/config/db');
const { notFound, errorHandler } = require('../server/middleware/errorMiddleware');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for easier deployment of 3rd party scripts/images
}));
app.use(morgan('dev'));

// Define Routes
app.use('/api/auth', require('../server/routes/authRoutes'));
app.use('/api/requests', require('../server/routes/requestRoutes'));
app.use('/api/logs', require('../server/routes/logRoutes'));

// Basic health check for Vercel
app.get('/api', (req, res) => {
  res.json({ message: "API is responding" });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
