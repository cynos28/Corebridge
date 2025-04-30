const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    studentName: {
        type: String,
        required: true
    },
    grade: {
        type: String,
        required: true
    },
    issue: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
