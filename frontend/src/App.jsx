import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import PersonalSubjects from './pages/PersonalSubjects';
import PersonalTasks from './pages/PersonalTasks';
import PersonalNotes from './pages/PersonalNotes';
import ExpenseTracker from './pages/ExpenseTracker';
import ClassSpaceStudent from './pages/ClassSpaceStudent';
import ClassSpaceCR from './pages/ClassSpaceCR';
import Attendance from './pages/Attendance';
import Header from './components/Header';
import HappinessCourse from './pages/HappinessCourse';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('student'); // 'student' or 'cr'
  const [currentUser, setCurrentUser] = useState(null);

  // Check localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedRole = localStorage.getItem('userRole');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setUserRole(savedRole || 'student');
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (user, role) => {
    setCurrentUser(user);
    setUserRole(role);
    setIsLoggedIn(true);
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('userRole', role);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserRole('student');
    setIsLoggedIn(false);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
  };

  useEffect(() => {
    if (isLoggedIn) {
      document.body.classList.add('app-logged-in');
      document.body.style.backgroundColor = ''; // Clear inline styles
    } else {
      document.body.classList.remove('app-logged-in');
      document.body.style.backgroundColor = ''; // Clear inline styles
    }
  }, [isLoggedIn]);

  return (
    <Router>
      <div className="App">
        {isLoggedIn && <Header userRole={userRole} currentUser={currentUser} onLogout={handleLogout} />}
        <Routes>
          <Route
            path="/login"
            element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />}
          />
          <Route
            path="/signup"
            element={isLoggedIn ? <Navigate to="/dashboard" /> : <Signup onLogin={handleLogin} />}
          />
          <Route
            path="/dashboard"
            element={isLoggedIn ? <Dashboard userRole={userRole} /> : <Navigate to="/login" />}
          />
          <Route
            path="/subjects"
            element={isLoggedIn ? <PersonalSubjects /> : <Navigate to="/login" />}
          />
          <Route
            path="/tasks"
            element={isLoggedIn ? <PersonalTasks /> : <Navigate to="/login" />}
          />
          <Route
            path="/notes"
            element={isLoggedIn ? <PersonalNotes /> : <Navigate to="/login" />}
          />
          <Route
            path="/expenses"
            element={isLoggedIn ? <ExpenseTracker /> : <Navigate to="/login" />}
          />
          <Route
            path="/happiness-course"
            element={isLoggedIn ? <HappinessCourse /> : <Navigate to="/login" />}
          />
          <Route
            path="/class-space"
            element={
              isLoggedIn ? (
                userRole === 'cr' ? <ClassSpaceCR /> : <ClassSpaceStudent />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/attendance"
            element={
              isLoggedIn && userRole === 'cr' ? (
                <Attendance />
              ) : (
                isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
              )
            }
          />
          <Route path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
