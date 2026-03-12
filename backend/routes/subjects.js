const express = require('express');
const Subject = require('../models/Subject');
const auth = require('../middleware/auth');

const router = express.Router();

// Create subject
router.post('/', auth, async (req, res) => {
  try {
    const { name, code, professor, credits, semester, schedule } = req.body;

    const subject = new Subject({
      userId: req.userId,
      name,
      code,
      professor,
      credits: credits || 0,
      semester,
      schedule
    });

    await subject.save();

    res.status(201).json({
      message: 'Subject created successfully',
      subject
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all subjects for user
router.get('/', auth, async (req, res) => {
  try {
    const subjects = await Subject.find({ userId: req.userId })
      .sort({ createdAt: -1 });

    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single subject
router.get('/:id', auth, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    if (subject.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.status(200).json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update subject
router.put('/:id', auth, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    if (subject.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { name, code, professor, credits, semester, schedule } = req.body;

    subject.name = name || subject.name;
    subject.code = code || subject.code;
    subject.professor = professor || subject.professor;
    subject.credits = credits !== undefined ? credits : subject.credits;
    subject.semester = semester || subject.semester;
    subject.schedule = schedule || subject.schedule;
    subject.updatedAt = Date.now();

    await subject.save();

    res.status(200).json({
      message: 'Subject updated successfully',
      subject
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete subject
router.delete('/:id', auth, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    if (subject.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Subject.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Subject deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
