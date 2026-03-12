import React, { useState, useEffect } from 'react';

function Attendance() {
  const [students, setStudents] = useState([]);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');

  useEffect(() => {
    // Load students and attendance from localStorage
    const savedStudents = localStorage.getItem('students');
    const savedAttendance = localStorage.getItem('attendance');
    
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    } else {
      // Initialize with dummy students ONLY if none exist in localStorage
      const defaultStudents = [
        { id: 1, name: 'John Doe', rollNo: '001', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', rollNo: '002', email: 'jane@example.com' },
        { id: 3, name: 'Bob Johnson', rollNo: '003', email: 'bob@example.com' },
        { id: 4, name: 'Alice Williams', rollNo: '004', email: 'alice@example.com' },
        { id: 5, name: 'Charlie Brown', rollNo: '005', email: 'charlie@example.com' }
      ];
      setStudents(defaultStudents);
      localStorage.setItem('students', JSON.stringify(defaultStudents));
    }

    if (savedAttendance) {
      setAttendanceRecords(JSON.parse(savedAttendance));
    }
  }, []);

  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!newStudentName.trim()) {
      alert('Please enter a student name');
      return;
    }

    const newStudent = {
      id: Date.now(),
      name: newStudentName.trim(),
      email: newStudentEmail.trim(),
      rollNo: String(students.length + 1).padStart(3, '0')
    };

    const updated = [...students, newStudent];
    setStudents(updated);
    localStorage.setItem('students', JSON.stringify(updated));
    setNewStudentName('');
    setNewStudentEmail('');
    setShowAddStudent(false);
  };

  const handleDeleteStudent = (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      const updated = students.filter(s => s.id !== id);
      setStudents(updated);
      localStorage.setItem('students', JSON.stringify(updated));
      
      // Also remove from attendance records
      const updatedRecords = { ...attendanceRecords };
      Object.keys(updatedRecords).forEach(date => {
        updatedRecords[date] = updatedRecords[date].filter(record => record.studentId !== id);
      });
      setAttendanceRecords(updatedRecords);
      localStorage.setItem('attendance', JSON.stringify(updatedRecords));
    }
  };

  const handleAttendanceChange = (studentId, isPresent) => {
    const dateKey = attendanceDate;
    const currentRecords = attendanceRecords[dateKey] || [];
    
    const existingIndex = currentRecords.findIndex(r => r.studentId === studentId);
    
    let updatedRecords;
    if (existingIndex >= 0) {
      updatedRecords = [...currentRecords];
      updatedRecords[existingIndex] = { ...updatedRecords[existingIndex], isPresent };
    } else {
      updatedRecords = [...currentRecords, { studentId, isPresent }];
    }

    const newAttendanceRecords = {
      ...attendanceRecords,
      [dateKey]: updatedRecords
    };

    setAttendanceRecords(newAttendanceRecords);
    localStorage.setItem('attendance', JSON.stringify(newAttendanceRecords));
  };

  const getAttendanceStatus = (studentId) => {
    const dateKey = attendanceDate;
    const records = attendanceRecords[dateKey] || [];
    const record = records.find(r => r.studentId === studentId);
    return record ? record.isPresent : false;
  };

  const getAttendanceStats = () => {
    const dateKey = attendanceDate;
    const records = attendanceRecords[dateKey] || [];
    const present = records.filter(r => r.isPresent).length;
    const total = students.length;
    return { present, total, absent: total - present };
  };

  const stats = getAttendanceStats();

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#2c3e50' }}>Attendance & Happiness Labs</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowAddStudent(!showAddStudent)}
        >
          {showAddStudent ? 'Cancel' : '+ Add Student'}
        </button>
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <p style={{ fontSize: '13px', color: '#6c757d' }}>
          You can use this page both for regular class attendance and for practical <strong>happiness lab sessions</strong> 
          related to relaxation, reflection, digital detox or other activities from your happiness journey.
        </p>
      </div>

      {showAddStudent && (
        <div className="card">
          <h3>Add New Student</h3>
          <form onSubmit={handleAddStudent}>
            <div className="form-group">
              <label htmlFor="student-name">Student Name *</label>
              <input
                type="text"
                id="student-name"
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                placeholder="Enter student name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="student-email">Student Email *</label>
              <input
                type="email"
                id="student-email"
                value={newStudentEmail}
                onChange={(e) => setNewStudentEmail(e.target.value)}
                placeholder="Enter student email"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Add Student</button>
          </form>
        </div>
      )}

      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="form-group">
          <label htmlFor="attendance-date">Select Date</label>
          <input
            type="date"
            id="attendance-date"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
            style={{ maxWidth: '300px' }}
          />
        </div>
        <div style={{ marginTop: '15px', display: 'flex', gap: '20px' }}>
          <div>
            <strong>Present:</strong> <span style={{ color: '#27ae60' }}>{stats.present}</span>
          </div>
          <div>
            <strong>Absent:</strong> <span style={{ color: '#e74c3c' }}>{stats.absent}</span>
          </div>
          <div>
            <strong>Total:</strong> {stats.total}
          </div>
        </div>
      </div>

      {students.length === 0 ? (
        <div className="empty-state">
          <p>No students added yet. Click "Add Student" to get started.</p>
        </div>
      ) : (
        <div className="card">
          <h3>Mark Attendance for {new Date(attendanceDate).toLocaleDateString()}</h3>
          <div className="checkbox-group" style={{ marginTop: '20px' }}>
            {students.map(student => (
              <div key={student.id} className="checkbox-item">
                <input
                  type="checkbox"
                  id={`student-${student.id}`}
                  checked={getAttendanceStatus(student.id)}
                  onChange={(e) => handleAttendanceChange(student.id, e.target.checked)}
                />
                <label htmlFor={`student-${student.id}`}>
                  <strong>{student.name}</strong> 
                  <span style={{ fontSize: '0.9em', color: '#666', marginLeft: '5px' }}>
                    ({student.email ? student.email + ' - ' : ''}Roll No: {student.rollNo})
                  </span>
                </label>
                <button 
                  className="btn btn-danger btn-small" 
                  onClick={() => handleDeleteStudent(student.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Attendance;
