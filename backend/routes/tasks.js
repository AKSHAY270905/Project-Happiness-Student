const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();

// Create task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, priority, category, dueDate, tags, notes, repeating } = req.body;

    const task = new Task({
      userId: req.userId,
      title,
      description,
      priority: priority || 'medium',
      category: category || 'personal',
      dueDate,
      tags: tags || [],
      notes,
      repeating: repeating || 'none'
    });

    await task.save();

    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all tasks
router.get('/', auth, async (req, res) => {
  try {
    const { status, priority, category } = req.query;
    let filter = { userId: req.userId };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;

    const tasks = await Task.find(filter).sort({ dueDate: 1, priority: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get pending tasks
router.get('/pending', auth, async (req, res) => {
  try {
    const tasks = await Task.find({
      userId: req.userId,
      status: { $in: ['pending', 'in-progress'] }
    }).sort({ dueDate: 1, priority: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get completed tasks
router.get('/completed', auth, async (req, res) => {
  try {
    const tasks = await Task.find({
      userId: req.userId,
      status: 'completed'
    }).sort({ completedAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single task
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update task
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { title, description, priority, category, dueDate, status, tags, notes, repeating } = req.body;

    task.title = title || task.title;
    task.description = description || task.description;
    task.priority = priority || task.priority;
    task.category = category || task.category;
    task.dueDate = dueDate || task.dueDate;
    task.status = status || task.status;
    task.tags = tags || task.tags;
    task.notes = notes || task.notes;
    task.repeating = repeating || task.repeating;

    if (status === 'completed' && !task.completedAt) {
      task.completedAt = new Date();
    }

    task.updatedAt = Date.now();

    await task.save();

    res.status(200).json({
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark task as completed
router.put('/:id/complete', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    task.status = 'completed';
    task.completedAt = new Date();
    task.updatedAt = Date.now();

    await task.save();

    res.status(200).json({
      message: 'Task marked as completed',
      task
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add subtask
router.post('/:id/subtask', auth, async (req, res) => {
  try {
    const { title } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    task.subtasks.push({
      title,
      completed: false,
      createdAt: new Date()
    });

    await task.save();

    res.status(200).json({
      message: 'Subtask added successfully',
      task
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update subtask
router.put('/:id/subtask/:subtaskId', auth, async (req, res) => {
  try {
    const { completed } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const subtask = task.subtasks.id(req.params.subtaskId);
    if (!subtask) {
      return res.status(404).json({ message: 'Subtask not found' });
    }

    subtask.completed = completed;
    await task.save();

    res.status(200).json({
      message: 'Subtask updated successfully',
      task
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
