import React, { useState, useEffect } from 'react';
import { tasksAPI } from '../services/api';
import './PersonalTasks.css';

function PersonalTasks() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    priority: 'medium'
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await tasksAPI.getAllTasks();
        setTasks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load tasks', err);
      }
    };

    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.deadline) {
      alert('Please fill in title and deadline');
      return;
    }

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        dueDate: formData.deadline
      };

      if (editingTask) {
        // Update existing task
        const res = await tasksAPI.updateTask(editingTask._id, payload);
        const updated = res && res.task ? res.task : null;
        if (updated) {
          const newTasks = tasks.map(t => t._id === updated._id ? updated : t);
          setTasks(newTasks);
        }
        setEditingTask(null);
      } else {
        // Add new task
        const res = await tasksAPI.createTask(payload);
        const created = res && res.task ? res.task : null;
        if (created) {
          setTasks(prev => [created, ...prev]);
        }
      }
    } catch (err) {
      console.error('Task operation failed', err);
      alert(err.message || 'Failed to save task');
      return;
    }

    setFormData({ title: '', description: '', deadline: '', priority: 'medium' });
    setShowForm(false);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      deadline: task.dueDate || task.deadline || '',
      priority: task.priority || 'medium'
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksAPI.deleteTask(id);
        const updated = tasks.filter(t => t._id !== id);
        setTasks(updated);
      } catch (err) {
        console.error('Delete failed', err);
        alert(err.message || 'Failed to delete task');
      }
    }
  };

  const handleToggleComplete = async (id) => {
    try {
      const task = tasks.find(t => t._id === id);
      if (!task) return;
      
      const res = await tasksAPI.updateTask(id, { status: task.status === 'completed' ? 'pending' : 'completed' });
      const updated = res && res.task ? res.task : null;
      if (updated) {
        const newTasks = tasks.map(t => t._id === updated._id ? updated : t);
        setTasks(newTasks);
      }
    } catch (err) {
      console.error('Toggle failed', err);
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#e74c3c';
      case 'medium': return '#f39c12';
      case 'low': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const getTaskDeadline = (task) => {
    return task.dueDate || task.deadline || null;
  };

  const getTimeRemaining = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate - now;
    
    if (diff < 0) return { text: 'Overdue', urgent: true };
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return { text: `${days} day${days > 1 ? 's' : ''} left`, urgent: days <= 1 };
    if (hours > 0) return { text: `${hours} hour${hours > 1 ? 's' : ''} left`, urgent: true };
    return { text: 'Due soon', urgent: true };
  };

  const cancelEdit = () => {
    setShowForm(false);
    setEditingTask(null);
    setFormData({ title: '', description: '', deadline: '', priority: 'medium' });
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return task.status !== 'completed';
    if (filter === 'completed') return task.status === 'completed';
    return true;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    active: tasks.filter(t => t.status !== 'completed').length,
    overdue: tasks.filter(t => {
      const d = getTaskDeadline(t);
      return t.status !== 'completed' && d && new Date(d) < new Date();
    }).length
  };

  const addHappinessTemplate = async (templateType) => {
    const now = new Date();
    const baseDeadline = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();

    const templates = {
      body: [
        {
          title: '10‑minute body relaxation',
          description: 'Short relaxation session focusing on breathing and releasing tension.',
          priority: 'medium',
          deadline: baseDeadline
        },
        {
          title: 'Practice Yog Nidra',
          description: 'Deep‑rest practice for better sleep and recovery.',
          priority: 'high',
          deadline: baseDeadline
        }
      ],
      mind: [
        {
          title: 'Evening gratitude journaling',
          description: 'Write 3 things you are grateful for today.',
          priority: 'medium',
          deadline: baseDeadline
        },
        {
          title: 'SCV formula reflection',
          description: 'Reflect on today using the SCV formula for happiness.',
          priority: 'high',
          deadline: baseDeadline
        },
        {
          title: 'Anger trigger mind map',
          description: 'Map your recent anger triggers and how you responded.',
          priority: 'medium',
          deadline: baseDeadline
        }
      ],
      digital: [
        {
          title: 'Digital detox 30 minutes before sleep',
          description: 'No screens 30 minutes before bedtime; prepare for deep rest.',
          priority: 'high',
          deadline: baseDeadline
        },
        {
          title: 'Screen time audit',
          description: 'Check today’s screen‑time report and note patterns.',
          priority: 'medium',
          deadline: baseDeadline
        },
        {
          title: 'Plan 24‑hour digital fasting',
          description: 'Choose a day for a full digital detox and plan offline activities.',
          priority: 'high',
          deadline: baseDeadline
        }
      ]
    };

    const selected = templates[templateType] || [];
    if (selected.length === 0) return;

    // Prefill the form with the first suggestion instead of auto-creating everything
    const suggestion = selected[0];
    setFormData({
      title: suggestion.title,
      description: suggestion.description,
      deadline: suggestion.deadline || '',
      priority: suggestion.priority || 'medium'
    });
    setShowForm(true);
  };

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <div>
          <h1 className="tasks-title">Tasks & Deadlines</h1>
          <p className="tasks-subtitle">Manage your tasks and track deadlines</p>
        </div>
        <button 
          className="add-task-btn" 
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) cancelEdit();
          }}
        >
          <span className="btn-icon">+</span>
          {showForm ? 'Cancel' : 'Add Task'}
        </button>
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <h2 style={{ marginBottom: '8px' }}>Happiness Routine Helpers</h2>
        <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '10px' }}>
          Quickly add suggested tasks for your happiness journey. You can edit or delete them anytime.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <button
            type="button"
            className="btn btn-secondary btn-small"
            onClick={() => addHappinessTemplate('body')}
          >
            🌿 Add Body Relaxation set
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-small"
            onClick={() => addHappinessTemplate('mind')}
          >
            🧠 Add Mind & Reflection set
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-small"
            onClick={() => addHappinessTemplate('digital')}
          >
            📵 Add Digital Detox set
          </button>
        </div>
      </div>



      {/* Stats Cards */}
      <div className="tasks-stats">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <div className="stat-value">{stats.completed}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <div className="stat-value">{stats.active}</div>
            <div className="stat-label">Active</div>
          </div>
        </div>
        <div className="stat-card urgent">
          <div className="stat-icon">⚠️</div>
          <div className="stat-info">
            <div className="stat-value">{stats.overdue}</div>
            <div className="stat-label">Overdue</div>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="tasks-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({stats.total})
        </button>
        <button 
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active ({stats.active})
        </button>
        <button 
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed ({stats.completed})
        </button>
      </div>

      {/* Task Form */}
      {showForm && (
        <div className="task-form-card">
          <div className="form-header">
            <h2>{editingTask ? '✏️ Edit Task' : '➕ Add New Task'}</h2>
          </div>
          <form onSubmit={handleSubmit} className="task-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  <span className="label-icon">📝</span>
                  Task Title *
                </label>
                <input
                  type="text"
                  id="title"
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Complete assignment"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  <span className="label-icon">📄</span>
                  Description
                </label>
                <textarea
                  id="description"
                  className="form-textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add task details..."
                  rows="4"
                />
              </div>
            </div>

            <div className="form-row form-row-2">
              <div className="form-group">
                <label htmlFor="deadline" className="form-label">
                  <span className="label-icon">⏰</span>
                  Deadline *
                </label>
                <input
                  type="datetime-local"
                  id="deadline"
                  className="form-input"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="priority" className="form-label">
                  <span className="label-icon">🎯</span>
                  Priority
                </label>
                <select
                  id="priority"
                  className="form-select"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                {editingTask ? '💾 Update Task' : '➕ Add Task'}
              </button>
              {editingTask && (
                <button type="button" className="cancel-btn" onClick={cancelEdit}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No tasks found</h3>
          <p>
            {filter === 'all' 
              ? "You don't have any tasks yet. Click 'Add Task' to get started!"
              : filter === 'active'
              ? "Great! All tasks are completed."
              : "No completed tasks yet."}
          </p>
        </div>
      ) : (
        <div className="tasks-list">
          {filteredTasks.map(task => {
            const deadline = getTaskDeadline(task);
            const timeInfo = deadline ? getTimeRemaining(deadline) : { text: 'No deadline', urgent: false };
            return (
              <div 
                key={task.id} 
                className={`task-card ${task.status === 'completed' ? 'completed' : ''} ${timeInfo.urgent && task.status !== 'completed' ? 'urgent' : ''}`}
                style={{ borderLeftColor: getPriorityColor(task.priority) }}
              >
                <div className="task-header">
                  <div className="task-checkbox-wrapper">
                    <input
                      type="checkbox"
                      id={`task-${task.id}`}
                      className="task-checkbox"
                      checked={task.status === 'completed'}
                      onChange={() => handleToggleComplete(task.id)}
                    />
                    <label htmlFor={`task-${task.id}`} className="task-checkbox-label"></label>
                  </div>
                  <h3 className={`task-title ${task.completed ? 'strikethrough' : ''}`}>
                    {task.title}
                  </h3>
                  <div className="task-priority-badge" style={{ backgroundColor: getPriorityColor(task.priority) }}>
                    {getPriorityIcon(task.priority)} {task.priority.toUpperCase()}
                  </div>
                </div>

                {task.description && (
                  <p className="task-description">{task.description}</p>
                )}

                  <div className="task-details">
                    <div className="task-detail-item">
                      <span className="detail-icon">📅</span>
                      <span className="detail-text">
                        {deadline
                          ? new Date(deadline).toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : 'No deadline set'}
                      </span>
                    </div>
                    <div className={`task-detail-item ${timeInfo.urgent && task.status !== 'completed' ? 'urgent-text' : ''}`}>
                      <span className="detail-icon">⏱️</span>
                      <span className="detail-text">{timeInfo.text}</span>
                    </div>
                  </div>

                <div className="task-actions">
                  <button 
                    className="action-btn edit-btn" 
                    onClick={() => handleEdit(task)}
                    disabled={task.completed}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    className="action-btn delete-btn" 
                    onClick={() => handleDelete(task._id || task.id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default PersonalTasks;
