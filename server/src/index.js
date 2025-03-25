const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require('dotenv').config();


const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/exams', require('./routes/exam.routes'));
app.use('/api/assignments', require('./routes/assignment.routes'));
app.use('/api/results', require('./routes/result.routes'));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    startServer();
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Exit process with failure
  });

  
function startServer(retries = 3) {
    const PORT = process.env.PORT || 5000;
    
    const server = app.listen(PORT)
      .on('listening', () => {
        console.log(`Server is running on port ${PORT}`);
      })
      .on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.log(`Port ${PORT} is busy, trying port ${PORT + 1}`);
          if (retries > 0) {
            process.env.PORT = PORT + 1;
            server.close();
            startServer(retries - 1);
          } else {
            console.error('No available ports found after retries');
            process.exit(1);
          }
        } else {
          console.error('Server error:', err);
          process.exit(1);
        }
      });
  }
  
  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
  });
  