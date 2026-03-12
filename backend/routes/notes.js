const express = require('express');
const Note = require('../models/Note');
const auth = require('../middleware/auth');

const router = express.Router();

// Create note
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, subject, tags, isPublic, attachments } = req.body;

    const note = new Note({
      title,
      content,
      subject,
      tags: tags || [],
      isPublic: isPublic !== false,
      postedBy: req.userId,
      postedByRole: req.userRole,
      attachments: attachments || []
    });

    await note.save();
    await note.populate('postedBy', 'firstName lastName email');

    res.status(201).json({
      message: 'Note created successfully',
      note
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all public notes
router.get('/public', async (req, res) => {
  try {
    const { subject, tags } = req.query;
    let filter = { isPublic: true };

    if (subject) filter.subject = subject;
    if (tags) filter.tags = { $in: tags.split(',') };

    const notes = await Note.find(filter)
      .populate('postedBy', 'firstName lastName email role')
      .sort({ createdAt: -1 });

    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's notes
router.get('/my-notes', auth, async (req, res) => {
  try {
    const notes = await Note.find({ postedBy: req.userId })
      .populate('postedBy', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single note
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
      .populate('postedBy', 'firstName lastName email role');

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update note
router.put('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.postedBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { title, content, subject, tags, isPublic } = req.body;

    note.title = title || note.title;
    note.content = content || note.content;
    note.subject = subject || note.subject;
    note.tags = tags || note.tags;
    note.isPublic = isPublic !== undefined ? isPublic : note.isPublic;
    note.updatedAt = Date.now();

    await note.save();
    await note.populate('postedBy', 'firstName lastName email');

    res.status(200).json({
      message: 'Note updated successfully',
      note
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete note
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.postedBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Note.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Share note with users
router.post('/:id/share', auth, async (req, res) => {
  try {
    const { userId } = req.body;
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.postedBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (!note.sharedWith.includes(userId)) {
      note.sharedWith.push(userId);
      await note.save();
    }

    res.status(200).json({
      message: 'Note shared successfully',
      note
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
