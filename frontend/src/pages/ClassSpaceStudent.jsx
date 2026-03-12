import React, { useState, useEffect } from 'react';

function ClassSpaceStudent() {
  const [classNotes, setClassNotes] = useState([]);
  const [classDeadlines, setClassDeadlines] = useState([]);
  const [isAddedStudent, setIsAddedStudent] = useState(false);

  useEffect(() => {
    // Load class space data from localStorage
    const savedNotes = localStorage.getItem('classNotes');
    const savedDeadlines = localStorage.getItem('classDeadlines');
    const savedStudents = localStorage.getItem('students');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    if (savedNotes) {
      setClassNotes(JSON.parse(savedNotes));
    }
    if (savedDeadlines) {
      setClassDeadlines(JSON.parse(savedDeadlines));
    }

    if (savedStudents && currentUser.email) {
      const students = JSON.parse(savedStudents);
      const isAdded = students.some(s => s.email === currentUser.email);
      setIsAddedStudent(isAdded);
    }
  }, []);

  return (
    <div className="container">
      <h2 style={{ marginBottom: '30px', color: '#2c3e50' }}>Class Space (Student View)</h2>
      <p style={{ color: '#7f8c8d', marginBottom: '20px' }}>
        View class notes and deadlines shared by your Class Representative.
      </p>

      <div className="card">
        <h2>Class Notes</h2>
        {classNotes.length === 0 ? (
          <div className="empty-state">
            <p>No class notes available yet.</p>
          </div>
        ) : (
          <div>
            {classNotes.map(note => (
              <div key={note.id} className="list-item">
                <h4>{note.title}</h4>
                <p style={{ whiteSpace: 'pre-wrap', marginBottom: '10px' }}>{note.content}</p>
                {note.fileUrl && (
                    <div style={{ marginTop: '5px', marginBottom: '10px' }}>
                      <strong>Attachment: </strong>
                      <a href={note.fileUrl} download={note.fileName} target="_blank" rel="noopener noreferrer" style={{ color: '#3498db', textDecoration: 'none' }}>
                        {note.fileName || 'View Document'} 📎
                      </a>
                    </div>
                )}
                <p style={{ fontSize: '12px', color: '#95a5a6' }}>
                  Posted: {new Date(note.createdAt).toLocaleString()}
                  {note.postedBy && ` by ${note.postedBy}`}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <h2>Class Deadlines</h2>
        {classDeadlines.length === 0 ? (
          <div className="empty-state">
            <p>No class deadlines available yet.</p>
          </div>
        ) : (
          <div>
            {classDeadlines.map(deadline => (
              <div key={deadline.id} className="list-item">
                <h4>{deadline.title}</h4>
                {deadline.description && <p>{deadline.description}</p>}
                <p><strong>Deadline:</strong> {new Date(deadline.deadline).toLocaleString()}</p>
                {deadline.subject && <p><strong>Subject:</strong> {deadline.subject}</p>}
                {deadline.fileUrl && (
                    <div style={{ marginTop: '5px', marginBottom: '10px' }}>
                      <strong>Attachment: </strong>
                      <a href={deadline.fileUrl} download={deadline.fileName} target="_blank" rel="noopener noreferrer" style={{ color: '#3498db', textDecoration: 'none' }}>
                        {deadline.fileName || 'View Document'} 📎
                      </a>
                    </div>
                )}
                <p style={{ fontSize: '12px', color: '#95a5a6' }}>
                  Posted: {new Date(deadline.createdAt).toLocaleString()}
                  {deadline.postedBy && ` by ${deadline.postedBy}`}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ClassSpaceStudent;
