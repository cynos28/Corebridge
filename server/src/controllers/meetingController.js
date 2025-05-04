const Meeting = require('../models/Meeting');

class MeetingController {
  // Create a new meeting
  static async createMeeting(req, res) {
    try {
      const { title, description, meetingDate, startTime, endTime, meetingLink, class: meetingClass, createdBy } = req.body;

      // Validate required fields
      if (!title || !description || !meetingDate || !startTime || !endTime || !meetingClass) {
        return res.status(400).json({
          status: 'error',
          message: 'Missing required fields',
          details: {
            title: !title,
            description: !description,
            meetingDate: !meetingDate,
            startTime: !startTime,
            endTime: !endTime,
            class: !meetingClass
          }
        });
      }

      // Parse and validate the date
      let parsedDate;
      try {
        parsedDate = new Date(meetingDate);
        if (isNaN(parsedDate.getTime())) {
          throw new Error('Invalid date format');
        }
      } catch (err) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid meeting date format',
          details: { meetingDate }
        });
      }

      // Validate time format (HH:mm)
      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
      if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid time format. Use HH:mm format (24-hour)',
          details: { startTime, endTime }
        });
      }

      // Create the meeting
      const meeting = new Meeting({
        title: title.trim(),
        description: description.trim(),
        meetingDate: parsedDate,
        startTime,
        endTime,
        meetingLink: meetingLink?.trim(),
        class: meetingClass.trim(),
        createdBy: createdBy || 'unknown'
      });

      await meeting.save();
      return res.status(201).json({
        status: 'success',
        data: meeting
      });

    } catch (error) {
      console.error('Error creating meeting:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to create meeting',
        details: error.message
      });
    }
  }

  // Get all meetings
  static async getMeetings(req, res) {
    try {
      const meetings = await Meeting.find()
        .sort({ meetingDate: 1, startTime: 1 })
        .lean();

      return res.status(200).json({
        status: 'success',
        data: meetings
      });
    } catch (error) {
      console.error('Error fetching meetings:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch meetings'
      });
    }
  }

  // Get a single meeting by ID
  static async getMeeting(req, res) {
    try {
      const meeting = await Meeting.findById(req.params.id).lean();

      if (!meeting) {
        return res.status(404).json({
          status: 'error',
          message: 'Meeting not found'
        });
      }

      return res.status(200).json({
        status: 'success',
        data: meeting
      });
    } catch (error) {
      console.error('Error fetching meeting:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch meeting'
      });
    }
  }

  // Update a meeting
  static async updateMeeting(req, res) {
    try {
      const { title, description, meetingDate, startTime, endTime, meetingLink, class: meetingClass } = req.body;

      // Parse and validate the date if provided
      let parsedDate;
      if (meetingDate) {
        try {
          parsedDate = new Date(meetingDate);
          if (isNaN(parsedDate.getTime())) {
            throw new Error('Invalid date format');
          }
        } catch (err) {
          return res.status(400).json({
            status: 'error',
            message: 'Invalid meeting date format',
            details: { meetingDate }
          });
        }
      }

      // Validate time format if provided
      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
      if ((startTime && !timeRegex.test(startTime)) || (endTime && !timeRegex.test(endTime))) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid time format. Use HH:mm format (24-hour)',
          details: { startTime, endTime }
        });
      }

      const meeting = await Meeting.findByIdAndUpdate(
        req.params.id,
        {
          ...(title && { title: title.trim() }),
          ...(description && { description: description.trim() }),
          ...(meetingDate && { meetingDate: parsedDate }),
          ...(startTime && { startTime }),
          ...(endTime && { endTime }),
          ...(meetingLink && { meetingLink: meetingLink.trim() }),
          ...(meetingClass && { class: meetingClass.trim() })
        },
        { new: true, runValidators: true }
      );

      if (!meeting) {
        return res.status(404).json({
          status: 'error',
          message: 'Meeting not found'
        });
      }

      return res.status(200).json({
        status: 'success',
        data: meeting
      });
    } catch (error) {
      console.error('Error updating meeting:', error);
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          status: 'error',
          message: 'Validation error',
          details: Object.keys(error.errors).reduce((acc, key) => {
            acc[key] = error.errors[key].message;
            return acc;
          }, {})
        });
      }
      return res.status(500).json({
        status: 'error',
        message: 'Failed to update meeting'
      });
    }
  }

  // Delete a meeting
  static async deleteMeeting(req, res) {
    try {
      const meeting = await Meeting.findByIdAndDelete(req.params.id);

      if (!meeting) {
        return res.status(404).json({
          status: 'error',
          message: 'Meeting not found'
        });
      }

      return res.status(200).json({
        status: 'success',
        message: 'Meeting deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting meeting:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to delete meeting'
      });
    }
  }
}

module.exports = MeetingController;