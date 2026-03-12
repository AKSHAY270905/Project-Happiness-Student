const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true
  },
  classes: [
    {
      subject: {
        type: String,
        required: true
      },
      startTime: {
        type: String,
        required: true // Format: HH:MM
      },
      endTime: {
        type: String,
        required: true
      },
      instructor: String,
      room: String,
      building: String,
      type: {
        type: String,
        enum: ['lecture', 'lab', 'tutorial', 'practical'],
        default: 'lecture'
      }
    }
  ],
  semester: Number,
  academicYear: String,
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure userId and day combination is unique
timetableSchema.index({ userId: 1, day: 1 }, { unique: true });

module.exports = mongoose.model('Timetable', timetableSchema);
