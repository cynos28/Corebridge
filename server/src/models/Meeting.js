const mongoose = require('mongoose');

const MeetingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    meetingDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    meetingLink: { type: String },
    class: { type: String, required: true },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Meeting', MeetingSchema);