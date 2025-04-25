const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Serve static files - Fix for image serving
app.use('/public', express.static(path.join(__dirname, '../public')));

// Update static file serving configuration
app.use('/public', express.static(path.join(__dirname, '../public')));

// Create upload directories
const uploadDir = path.join(__dirname, '../public/uploads/teachers');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const assignmentRoutes = require("./routes/assignmentRoutes");
const examRoutes = require("./routes/examRoutes");
const resultRoutes = require("./routes/resultsRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const ticketRoutes = require('./routes/ticketRoutes');
const authRoutes = require('./routes/auth')
const adminRoutes = require('./routes/adminRoutes');
const { initAdmin } = require('./controllers/authController');
const studentRoutes = require('./routes/studentRoutes');

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    startServer();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

function startServer(retries = 3) {
  const PORT = process.env.PORT || 5000;
  const server = app
    .listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    })
    .on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.log(`Port ${PORT} is busy, trying port ${PORT + 1}`);
        if (retries > 0) {
          process.env.PORT = Number(PORT) + 1;
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
}

// Routes - Update the order to have auth routes first
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/students', studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/results", resultRoutes);
app.use('/api/tickets', ticketRoutes);

// 404 handler (adds JSON content type)
app.use((req, res, next) => {
  res.status(404).setHeader('Content-Type', 'application/json');
  res.json({ message: "Endpoint not found" });
});

// Error handling middleware - add before routes
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
      message: 'Invalid token'
    });
  }

  // Default error
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal server error'
  });
});

// Initialize admin user after DB connection
mongoose.connection.once('open', () => {
  initAdmin();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.setHeader('Content-Type', 'application/json');
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  });
});
