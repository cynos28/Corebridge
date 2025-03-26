const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const assignmentRoutes = require("./routes/assignmentRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

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
  const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  }).on("error", (err) => {
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

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});
