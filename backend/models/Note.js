const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide note title'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Please provide note content']
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  postedByRole: String, // 'student' or 'cr'
  subject: String,
  tags: [String],
  isPublic: {
    type: Boolean,
    default: true
  },
  sharedWith: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  attachments: [
    {
      fileName: String,
      fileUrl: String,
      uploadedAt: Date
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Note', noteSchema);
