import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

function Dashboard({ userRole }) {
  const [stats, setStats] = useState({
    subjects: 0,
    tasks: 0,
    notes: 0,
    expenses: 0
  });

  useEffect(() => {
    // Load stats from localStorage
    const subjects = JSON.parse(localStorage.getItem('subjects') || '[]');
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');

    setStats({
      subjects: subjects.length,
      tasks: tasks.length,
      notes: notes.length,
      expenses: expenses.length
    });
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="dashboard-subtitle">Overview of your activities</p>
      </div>
      
      <div className="stats-grid">
        <Link to="/subjects" className="stat-card-link">
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              <h3>{stats.subjects}</h3>
              <p>Subjects</p>
            </div>
          </div>
        </Link>
        <Link to="/tasks" className="stat-card-link">
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>{stats.tasks}</h3>
              <p>Active Tasks</p>
            </div>
          </div>
        </Link>
        <Link to="/notes" className="stat-card-link">
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-content">
              <h3>{stats.notes}</h3>
              <p>Personal Notes</p>
            </div>
          </div>
        </Link>
        <Link to="/expenses" className="stat-card-link">
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>{stats.expenses}</h3>
              <p>Expenses Tracked</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="card">
        <h2>Quick Actions</h2>
        <div className="quick-actions-grid">
          <Link to="/subjects" className="action-card">
            <div className="action-icon">📚</div>
            <h3>Subjects</h3>
            <p>Manage your subjects</p>
          </Link>
          <Link to="/tasks" className="action-card">
            <div className="action-icon">✅</div>
            <h3>Tasks</h3>
            <p>View and manage tasks</p>
          </Link>
          <Link to="/notes" className="action-card">
            <div className="action-icon">📝</div>
            <h3>Notes</h3>
            <p>Personal notes</p>
          </Link>
          <Link to="/expenses" className="action-card">
            <div className="action-icon">💰</div>
            <h3>Expenses</h3>
            <p>Track expenses</p>
          </Link>
          <Link to="/class-space" className="action-card">
            <div className="action-icon">🏫</div>
            <h3>Class Space</h3>
            <p>{userRole === 'cr' ? 'Manage class space' : 'View class space'}</p>
          </Link>
          {userRole === 'cr' && (
            <Link to="/attendance" className="action-card">
              <div className="action-icon">📋</div>
              <h3>Attendance</h3>
              <p>Mark attendance</p>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
