const Ticket = require("../models/Ticket");

exports.createTicket = async (req, res) => {
    try {
        const ticket = new Ticket(req.body);
        const savedTicket = await ticket.save();
        res.status(201).json(savedTicket);
    } catch (error) {
        console.error("Error creating ticket:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.getTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find();
        res.status(200).json(tickets);
    } catch (error) {
        console.error("Error getting tickets:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.getTicketById = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }
        res.status(200).json(ticket);
    } catch (error) {
        console.error("Error getting ticket:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.updateTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }
        res.status(200).json(ticket);
    } catch (error) {
        console.error("Error updating ticket:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.deleteTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndDelete(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }
        res.status(200).json({ message: "Ticket deleted successfully" });
    } catch (error) {
        console.error("Error deleting ticket:", error);
        res.status(500).json({ message: error.message });
    }
};
