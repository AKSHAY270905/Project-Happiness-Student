const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide task title'],
    trim: true
  },
  description: String,
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  category: {
    type: String,
    enum: ['study', 'personal', 'work', 'health', 'misc'],
    default: 'personal'
  },
  dueDate: Date,
  tags: [String],
  subtasks: [
    {
      title: String,
      completed: {
        type: Boolean,
        default: false
      },
      createdAt: Date
    }
  ],
  attachments: [
    {
      fileName: String,
      fileUrl: String,
      uploadedAt: Date
    }
  ],
  notes: String,
  repeating: {
    type: String,
    enum: ['none', 'daily', 'weekly', 'monthly'],
    default: 'none'
  },
  reminder: {
    enabled: Boolean,
    time: String // HH:MM
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date
});

taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ userId: 1, dueDate: 1 });

module.exports = mongoose.model('Task', taskSchema);
