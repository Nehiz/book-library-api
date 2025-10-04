const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const dbUri = process.env.MONGODB_URI;

// Middleware
app.use(cors());
app.use(express.json());

// Serve Swagger UI at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/', require('./routes/index'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Express error:', err);
  res.status(500).json({
    success: false,
    message: 'Server Error',
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
  });
});

// Connect to MongoDB using Mongoose
mongoose.connect(dbUri)
  .then(() => {
    console.log('✅ Connected to MongoDB!');
    
    // Start the server only after successful MongoDB connection
    const server = app.listen(PORT, () => {
      console.log(`
🚀 Book Library API Server Started!
📍 Environment: ${process.env.NODE_ENV || 'development'}
🌐 Server running on port ${PORT}
📡 API Base URL: http://localhost:${PORT}/api/v1
📚 Books endpoint: http://localhost:${PORT}/api/v1/books
👤 Authors endpoint: http://localhost:${PORT}/api/v1/authors
📋 Health check: http://localhost:${PORT}/
📖 API Documentation: http://localhost:${PORT}/api-docs
      `);
    });

    server.on('error', (error) => {
      console.error('❌ Server error:', error);
    });
    
    // Export server for potential external use
    module.exports = server;
  })
  .catch(err => {
    console.error('❌ Could not connect to MongoDB:', err);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`❌ Unhandled Rejection: ${err.message}`);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(`❌ Uncaught Exception: ${err.message}`);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received. Shutting down gracefully...');
  process.exit(0);
});