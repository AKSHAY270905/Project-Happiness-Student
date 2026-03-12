import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header({ userRole, currentUser, onLogout }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="header-nav">
        <div>
          <h1>🎓 CampusMate</h1>
          {currentUser && (
            <p style={{ fontSize: '13px', color: '#6c757d', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Welcome, <strong>{currentUser.name}</strong></span>
              <span className={`role-badge ${userRole === 'cr' ? 'cr' : ''}`}>
                {userRole === 'cr' ? 'CR' : 'Student'}
              </span>
            </p>
          )}
        </div>
        <nav>
          <ul className="nav-links">
            <li>
              <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
                📊 Dashboard
              </Link>
            </li>
            <li>
              <Link to="/subjects" className={isActive('/subjects') ? 'active' : ''}>
                📚 Subjects
              </Link>
            </li>
            <li>
              <Link to="/tasks" className={isActive('/tasks') ? 'active' : ''}>
                ✅ Tasks
              </Link>
            </li>
            <li>
              <Link to="/notes" className={isActive('/notes') ? 'active' : ''}>
                📝 Notes
              </Link>
            </li>
            <li>
              <Link to="/expenses" className={isActive('/expenses') ? 'active' : ''}>
                💰 Expenses
              </Link>
            </li>
            <li>
              <Link to="/happiness-course" className={isActive('/happiness-course') ? 'active' : ''}>
                😊 Happiness Journey
              </Link>
            </li>
            <li>
              <Link to="/class-space" className={isActive('/class-space') ? 'active' : ''}>
                🏫 Class Space
              </Link>
            </li>
            {userRole === 'cr' && (
              <li>
                <Link to="/attendance" className={isActive('/attendance') ? 'active' : ''}>
                  📋 Attendance
                </Link>
              </li>
            )}
            <li>
              <button className="btn btn-secondary btn-small" onClick={onLogout}>
                🚪 Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
