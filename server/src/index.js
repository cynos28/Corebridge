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

// Serve static files - Fix for image serving
app.use('/public', express.static(path.join(__dirname, '../public')));

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../public/uploads/teachers');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

const assignmentRoutes = require("./routes/assignmentRoutes");
const examRoutes = require("./routes/examRoutes");
const resultRoutes = require("./routes/resultsRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const ticketRoutes = require('./routes/ticketRoutes');

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

app.use("/api/assignments", assignmentRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/teachers", teacherRoutes);
app.use('/api/tickets', ticketRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});
