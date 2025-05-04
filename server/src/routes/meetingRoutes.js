const express = require('express');
const router = express.Router();
const MeetingController = require('../controllers/meetingController');

// Create a new meeting - removed auth middleware
router.post('/', MeetingController.createMeeting);

// Get all meetings
router.get('/', MeetingController.getMeetings);

// Get a single meeting
router.get('/:id', MeetingController.getMeeting);

// Update a meeting
router.put('/:id', MeetingController.updateMeeting);

// Delete a meeting
router.delete('/:id', MeetingController.deleteMeeting);

module.exports = router;