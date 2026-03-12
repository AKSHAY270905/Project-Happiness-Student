const express = require('express');
const Assignment = require('../models/Assignment');
const auth = require('../middleware/auth');

const router = express.Router();

// Create assignment (CR only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.userRole !== 'cr') {
      return res.status(403).json({ message: 'Only CR can create assignments' });
    }

    const { title, description, type, subject, deadline, priority, assignedTo } = req.body;

    const assignment = new Assignment({
      title,
      description,
      type,
      subject,
      deadline,
      priority: priority || 'medium',
      postedBy: req.userId,
      assignedTo: assignedTo || []
    });

    await assignment.save();
    await assignment.populate('postedBy assignedTo', 'firstName lastName email');

    res.status(201).json({
      message: 'Assignment created successfully',
      assignment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all assignments for class
router.get('/class', auth, async (req, res) => {
  try {
    const { subject, type, status } = req.query;
    let filter = {};

    if (subject) filter.subject = subject;
    if (type) filter.type = type;
    if (status) filter.status = status;

    const assignments = await Assignment.find(filter)
      .populate('postedBy assignedTo', 'firstName lastName email')
      .sort({ deadline: 1 });

    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get assigned assignments for student
router.get('/my-assignments', auth, async (req, res) => {
  try {
    const { status } = req.query;
    let filter = { assignedTo: req.userId };

    if (status) filter.status = status;

    const assignments = await Assignment.find(filter)
      .populate('postedBy assignedTo', 'firstName lastName email')
      .sort({ deadline: 1 });

    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single assignment
router.get('/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('postedBy assignedTo comments.userId', 'firstName lastName email');

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.status(200).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update assignment
router.put('/:id', auth, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    if (assignment.postedBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { title, description, type, subject, deadline, priority, status, marks } = req.body;

    assignment.title = title || assignment.title;
    assignment.description = description || assignment.description;
    assignment.type = type || assignment.type;
    assignment.subject = subject || assignment.subject;
    assignment.deadline = deadline || assignment.deadline;
    assignment.priority = priority || assignment.priority;
    assignment.status = status || assignment.status;
    if (marks) assignment.marks = marks;
    assignment.updatedAt = Date.now();

    await assignment.save();
    await assignment.populate('postedBy assignedTo', 'firstName lastName email');

    res.status(200).json({
      message: 'Assignment updated successfully',
      assignment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit assignment
router.put('/:id/submit', auth, async (req, res) => {
  try {
    const { submissionUrl } = req.body;
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    if (!assignment.assignedTo.includes(req.userId)) {
      return res.status(403).json({ message: 'Assignment not assigned to you' });
    }

    assignment.submissionUrl = submissionUrl;
    assignment.status = 'submitted';
    assignment.updatedAt = Date.now();

    await assignment.save();

    res.status(200).json({
      message: 'Assignment submitted successfully',
      assignment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete assignment
router.delete('/:id', auth, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    if (assignment.postedBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Assignment.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add comment to assignment
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    assignment.comments.push({
      userId: req.userId,
      text,
      timestamp: new Date()
    });

    await assignment.save();
    await assignment.populate('comments.userId', 'firstName lastName email');

    res.status(200).json({
      message: 'Comment added successfully',
      assignment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
