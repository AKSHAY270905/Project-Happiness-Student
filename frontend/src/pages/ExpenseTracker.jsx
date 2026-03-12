import React, { useState, useEffect } from 'react';
import { expensesAPI } from '../services/api';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'food',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const data = await expensesAPI.getAllExpenses();
        setExpenses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load expenses', err);
      }
    };

    fetchExpenses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) {
      alert('Please fill in description and amount');
      return;
    }

    try {
      const res = await expensesAPI.createExpense({ ...formData, amount: parseFloat(formData.amount) });
      const created = res && res.expense ? res.expense : null;
      if (created) {
        setExpenses(prev => [created, ...prev]);
      }
    } catch (err) {
      console.error('Create expense failed', err);
      alert(err.message || 'Failed to create expense');
      return;
    }
    
    setFormData({
      description: '',
      amount: '',
      category: 'food',
      date: new Date().toISOString().split('T')[0]
    });
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await expensesAPI.deleteExpense(id);
        const updated = expenses.filter(e => e._id !== id);
        setExpenses(updated);
      } catch (err) {
        console.error('Delete failed', err);
        alert(err.message || 'Failed to delete expense');
      }
    }
  };

  // Calculate monthly expenses
  const getMonthlyData = () => {
    const monthly = {};
    expenses.forEach(expense => {
      const dateStr = expense.date instanceof Date ? expense.date : new Date(expense.date);
      const month = dateStr.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (!monthly[month]) {
        monthly[month] = 0;
      }
      monthly[month] += expense.amount || 0;
    });

    const months = Object.keys(monthly).sort((a, b) => {
      return new Date(a) - new Date(b);
    });

    return {
      labels: months,
      amounts: months.map(m => monthly[m])
    };
  };

  const monthlyData = getMonthlyData();
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const chartData = {
    labels: monthlyData.labels,
    datasets: [
      {
        label: 'Monthly Expenses (₹)',
        data: monthlyData.amounts,
        backgroundColor: 'rgba(52, 152, 219, 0.6)',
        borderColor: 'rgba(52, 152, 219, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Expense Chart',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const getCategoryColor = (category) => {
    const colors = {
      food: '#e74c3c',
      transport: '#3498db',
      books: '#9b59b6',
      entertainment: '#f39c12',
      other: '#95a5a6'
    };
    return colors[category] || colors.other;
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#2c3e50' }}>Expense Tracker</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Expense'}
        </button>
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <h3>Happiness‑Aligned Spending</h3>
        <p style={{ fontSize: '13px', color: '#6c757d' }}>
          Use this tracker to notice whether your money goes towards <strong>well‑being</strong> (for example, healthy food, books, meaningful
          experiences) or towards habits that do not support your happiness. Reflect on each entry: “Does this increase my long‑term
          well‑being?”.
        </p>
      </div>

      <div className="card" style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>
          Total Expenses: ₹{totalExpenses.toFixed(2)}
        </h3>
      </div>

      {showForm && (
        <div className="card">
          <h3>Add New Expense</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <input
                type="text"
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g., Lunch at cafeteria"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="amount">Amount (₹) *</label>
              <input
                type="number"
                id="amount"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="e.g., 150.00"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="food">Food</option>
                <option value="transport">Transport</option>
                <option value="books">Books & Supplies</option>
                <option value="entertainment">Entertainment</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Add Expense</button>
          </form>
        </div>
      )}

      {expenses.length > 0 && (
        <div className="card" style={{ marginBottom: '30px' }}>
          <h3>Monthly Expense Chart</h3>
          <div style={{ height: '300px', marginTop: '20px' }}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      )}

      {expenses.length === 0 ? (
        <div className="empty-state">
          <p>No expenses tracked yet. Click "Add Expense" to get started.</p>
        </div>
      ) : (
        <div>
          <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>Expense History</h3>
          {expenses.map(expense => (
            <div key={expense._id || expense.id} className="list-item" style={{ 
              borderLeftColor: getCategoryColor(expense.category)
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h4>{expense.description}</h4>
                  <p><strong>Amount:</strong> ₹{expense.amount.toFixed(2)}</p>
                  <p><strong>Category:</strong> {expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}</p>
                  <p><strong>Date:</strong> {new Date(expense.date).toLocaleDateString()}</p>
                </div>
                <button 
                  className="btn btn-danger btn-small" 
                  onClick={() => handleDelete(expense._id || expense.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExpenseTracker;
