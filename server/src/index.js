const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();

// Security middleware
app.use(helmet()); // Adds security headers

// Rate limiting to prevent brute force attacks
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { status: "error", message: "Too many requests, please try again later" }
});

// Apply rate limiting to all routes
app.use(apiLimiter);

// Standard middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Limit JSON body size
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Create all required upload directories
const createUploadDirs = () => {
  const dirs = [
    path.join(__dirname, 'uploads'),
    path.join(__dirname, 'uploads/submissions'),
    path.join(__dirname, 'uploads/assignments'),
    path.join(__dirname, 'uploads/profiles'),
    path.join(__dirname, '../public/uploads/teachers')
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
};

// Create directories
createUploadDirs();

// Serve static files - with proper security
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: '1d', // Cache for 1 day
  setHeaders: (res, path) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
  }
}));

app.use('/public', express.static(path.join(__dirname, '../public'), {
  maxAge: '1d',
  setHeaders: (res, path) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
  }
}));

// Import routes
const assignmentRoutes = require("./routes/assignmentRoutes");
const examRoutes = require("./routes/examRoutes");
const resultRoutes = require("./routes/resultsRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const meetingRoutes = require('./routes/meetingRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const adminRoutes = require('./routes/adminRoutes');
const studentRoutes = require('./routes/studentRoutes');
const authRoutes       = require('./routes/auth');
const { initAdmin }    = require('./controllers/authController');


// Connect to MongoDB with improved options
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5s
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  })
  .then(() => {
    console.log("Connected to MongoDB");
    // Initialize admin user
    mongoose.connection.once('open', initAdmin);
    startServer();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

// Improved server startup with better error handling
function startServer(retries = 3) {
  const PORT = process.env.PORT || 5000;
  
  const server = app
    .listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Server started at: ${new Date().toISOString()}`);
    })
    .on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.log(`Port ${PORT} is busy, trying port ${PORT + 1}`);
        if (retries > 0) {
          const newPort = Number(PORT) + 1;
          process.env.PORT = newPort;
          server.close();
          startServer(retries - 1);
        } else {
          console.error("No available ports found after retries");
          process.exit(1);
        }
      } else {
        console.error("Server error:", err);
        process.exit(1);
      }
    });
    
  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
      console.log('Server closed');
      mongoose.connection.close(false, () => {
        console.log('MongoDB connection closed');
        process.exit(0);
      });
    });
  });
}

// Routes - Proper order with auth routes first
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/students', studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/results", resultRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/meetings', meetingRoutes);

// 404 handler with proper content type
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: "Endpoint not found",
    path: req.originalUrl
  });
});

// Error handling middleware - consolidated into one middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  
  // Set proper content type
  res.setHeader('Content-Type', 'application/json');
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      status: 'error',
      message: 'Authentication required'
    });
  }
  
  if (err.name === 'ForbiddenError') {
    return res.status(403).json({
      status: 'error',
      message: 'Access denied'
    });
  }
  
  // Default error
  res.status(err.status || 500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : (err.message || 'Internal server error')
  });
});

module.exports = app;
