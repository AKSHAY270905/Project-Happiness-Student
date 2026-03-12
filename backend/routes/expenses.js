const express = require('express');
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');

const router = express.Router();

// Create expense
router.post('/', auth, async (req, res) => {
  try {
    const { description, category, amount, paymentMethod, date, status, tags, notes } = req.body;

    const expense = new Expense({
      userId: req.userId,
      description,
      category,
      amount,
      paymentMethod: paymentMethod || 'cash',
      date,
      status: status || 'paid',
      tags: tags || [],
      notes
    });

    await expense.save();

    res.status(201).json({
      message: 'Expense created successfully',
      expense
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all expenses for user
router.get('/', auth, async (req, res) => {
  try {
    const { category, startDate, endDate, status } = req.query;
    let filter = { userId: req.userId };

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(filter).sort({ date: -1 });

    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get expense summary
router.get('/summary', auth, async (req, res) => {
  try {
    const { month, year } = req.query;
    
    let filter = { userId: req.userId, status: 'paid' };
    
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      filter.date = { $gte: startDate, $lte: endDate };
    }

    // Get total expenses by category
    const categoryData = await Expense.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$category',
          amount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { amount: -1 } }
    ]);

    // Get total amount
    const totalData = await Expense.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      total: totalData[0]?.total || 0,
      count: totalData[0]?.count || 0,
      byCategory: categoryData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single expense
router.get('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (expense.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update expense
router.put('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (expense.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { description, category, amount, paymentMethod, date, status, tags, notes } = req.body;

    expense.description = description || expense.description;
    expense.category = category || expense.category;
    expense.amount = amount || expense.amount;
    expense.paymentMethod = paymentMethod || expense.paymentMethod;
    expense.date = date || expense.date;
    expense.status = status || expense.status;
    expense.tags = tags || expense.tags;
    expense.notes = notes || expense.notes;
    expense.updatedAt = Date.now();

    await expense.save();

    res.status(200).json({
      message: 'Expense updated successfully',
      expense
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete expense
router.delete('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (expense.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Expense.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
