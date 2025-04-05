const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const multer = require('multer');
const upload = multer();

// CRUD Routes
router.post('/', upload.none(), ticketController.createTicket);
router.get('/', ticketController.getTickets);
router.get('/:id', ticketController.getTicketById);
router.put('/:id', upload.none(), ticketController.updateTicket);
router.delete('/:id', ticketController.deleteTicket);

module.exports = router;
