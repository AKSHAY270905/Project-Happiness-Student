const express = require('express');
const Timetable = require('../models/Timetable');
const auth = require('../middleware/auth');

const router = express.Router();

// Create/Update timetable for a day
router.post('/', auth, async (req, res) => {
  try {
    const { day, classes, semester, academicYear } = req.body;

    let timetable = await Timetable.findOne({ userId: req.userId, day });

    if (timetable) {
      timetable.classes = classes;
      timetable.semester = semester || timetable.semester;
      timetable.academicYear = academicYear || timetable.academicYear;
      timetable.updatedAt = Date.now();
    } else {
      timetable = new Timetable({
        userId: req.userId,
        day,
        classes,
        semester,
        academicYear
      });
    }

    await timetable.save();

    res.status(201).json({
      message: 'Timetable saved successfully',
      timetable
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get complete timetable
router.get('/', auth, async (req, res) => {
  try {
    const timetable = await Timetable.find({ userId: req.userId, isActive: true });

    // Organize by day
    const organizedTimetable = {};
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    days.forEach(day => {
      const dayTable = timetable.find(t => t.day === day);
      organizedTimetable[day] = dayTable ? dayTable.classes : [];
    });

    res.status(200).json(organizedTimetable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get timetable for specific day
router.get('/:day', auth, async (req, res) => {
  try {
    const timetable = await Timetable.findOne({
      userId: req.userId,
      day: req.params.day.charAt(0).toUpperCase() + req.params.day.slice(1),
      isActive: true
    });

    if (!timetable) {
      return res.status(200).json({ classes: [] });
    }

    res.status(200).json(timetable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update class in timetable
router.put('/:id', auth, async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id);

    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }

    if (timetable.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { classIndex, classData } = req.body;

    if (classIndex >= 0 && classIndex < timetable.classes.length) {
      timetable.classes[classIndex] = {
        ...timetable.classes[classIndex],
        ...classData
      };
    }

    timetable.updatedAt = Date.now();
    await timetable.save();

    res.status(200).json({
      message: 'Timetable updated successfully',
      timetable
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete class from timetable
router.delete('/:id', auth, async (req, res) => {
  try {
    const { classIndex } = req.body;
    const timetable = await Timetable.findById(req.params.id);

    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }

    if (timetable.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (classIndex >= 0 && classIndex < timetable.classes.length) {
      timetable.classes.splice(classIndex, 1);
    }

    timetable.updatedAt = Date.now();
    await timetable.save();

    res.status(200).json({
      message: 'Class removed successfully',
      timetable
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
