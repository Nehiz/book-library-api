const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import database connection
const connectDB = require('./config/database');

// Import middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import routes
const bookRoutes = require('./routes/bookRoutes');
const authorRoutes = require('./routes/authorRoutes');

// Import Swagger setup
const setupSwagger = require('./config/swagger');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (development)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    next();
  });
}

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Book Library API is running successfully!',
    version: process.env.API_VERSION || 'v1',
    timestamp: new Date().toISOString(),
    endpoints: {
      books: '/api/v1/books',
      authors: '/api/v1/authors',
      documentation: '/api/v1/docs'
    }
  });
});

// API status endpoint
app.get('/api/v1/status', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Setup Swagger documentation
setupSwagger(app);

// Mount routes
app.use('/api/v1/books', bookRoutes);
app.use('/api/v1/authors', authorRoutes);

// 404 handler - must be after all routes
app.use(notFound);

// Global error handler - must be last
app.use(errorHandler);

module.exports = app;