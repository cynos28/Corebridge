const express = require('express');
const app = express();
const fs = require('fs');

// ...existing code...

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));

// Create uploads directory if it doesn't exist
const uploadDir = 'public/uploads/teachers';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// ...existing code...

module.exports = app;