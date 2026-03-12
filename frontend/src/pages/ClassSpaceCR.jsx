import React, { useState, useEffect } from 'react';

function ClassSpaceCR() {
  const [classNotes, setClassNotes] = useState([]);
  const [classDeadlines, setClassDeadlines] = useState([]);
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' or 'deadlines'
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [showDeadlineForm, setShowDeadlineForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [editingDeadline, setEditingDeadline] = useState(null);
  
  const [noteFormData, setNoteFormData] = useState({
    title: '',
    content: '',
    fileName: '',
    fileUrl: ''
  });

  const [deadlineFormData, setDeadlineFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    subject: '',
    fileName: '',
    fileUrl: ''
  });

  useEffect(() => {
    // Load class space data from localStorage
    const savedNotes = localStorage.getItem('classNotes');
    const savedDeadlines = localStorage.getItem('classDeadlines');
    
    if (savedNotes) {
      setClassNotes(JSON.parse(savedNotes));
    }
    if (savedDeadlines) {
      setClassDeadlines(JSON.parse(savedDeadlines));
    }
  }, []);

  const handleNoteSubmit = (e) => {
    e.preventDefault();
    if (!noteFormData.title || !noteFormData.content) {
      alert('Please fill in both title and content');
      return;
    }

    if (editingNote) {
      const updated = classNotes.map(n => 
        n.id === editingNote.id 
          ? { ...n, ...noteFormData, updatedAt: new Date().toISOString() }
          : n
      );
      setClassNotes(updated);
      localStorage.setItem('classNotes', JSON.stringify(updated));
      setEditingNote(null);
    } else {
      const newNote = {
        id: Date.now(),
        ...noteFormData,
        createdAt: new Date().toISOString(),
        postedBy: 'CR'
      };
      const updated = [...classNotes, newNote];
      setClassNotes(updated);
      localStorage.setItem('classNotes', JSON.stringify(updated));
    }

    setNoteFormData({ title: '', content: '', fileName: '', fileUrl: '' });
    setShowNoteForm(false);
  };

  const handleDeadlineSubmit = (e) => {
    e.preventDefault();
    if (!deadlineFormData.title || !deadlineFormData.deadline) {
      alert('Please fill in title and deadline');
      return;
    }

    if (editingDeadline) {
      const updated = classDeadlines.map(d => 
        d.id === editingDeadline.id 
          ? { ...d, ...deadlineFormData, updatedAt: new Date().toISOString() }
          : d
      );
      setClassDeadlines(updated);
      localStorage.setItem('classDeadlines', JSON.stringify(updated));
      setEditingDeadline(null);
    } else {
      const newDeadline = {
        id: Date.now(),
        ...deadlineFormData,
        createdAt: new Date().toISOString(),
        postedBy: 'CR'
      };
      const updated = [...classDeadlines, newDeadline];
      setClassDeadlines(updated);
      localStorage.setItem('classDeadlines', JSON.stringify(updated));
    }

    setDeadlineFormData({ title: '', description: '', deadline: '', subject: '', fileName: '', fileUrl: '' });
    setShowDeadlineForm(false);
  };

  const handleDeleteNote = (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      const updated = classNotes.filter(n => n.id !== id);
      setClassNotes(updated);
      localStorage.setItem('classNotes', JSON.stringify(updated));
    }
  };

  const handleDeleteDeadline = (id) => {
    if (window.confirm('Are you sure you want to delete this deadline?')) {
      const updated = classDeadlines.filter(d => d.id !== id);
      setClassDeadlines(updated);
      localStorage.setItem('classDeadlines', JSON.stringify(updated));
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setNoteFormData({ title: note.title, content: note.content, fileName: note.fileName || '', fileUrl: note.fileUrl || '' });
    setShowNoteForm(true);
  };

  const handleEditDeadline = (deadline) => {
    setEditingDeadline(deadline);
    setDeadlineFormData({
      title: deadline.title,
      description: deadline.description || '',
      deadline: deadline.deadline,
      subject: deadline.subject || '',
      fileName: deadline.fileName || '',
      fileUrl: deadline.fileUrl || ''
    });
    setShowDeadlineForm(true);
  };

  return (
    <div className="container">
      <h2 style={{ marginBottom: '30px', color: '#2c3e50' }}>Class Space (CR View)</h2>
      <p style={{ color: '#7f8c8d', marginBottom: '20px' }}>
        Manage class notes and deadlines for all students, including weekly updates and activities from your happiness journey.
      </p>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button 
          className={`btn ${activeTab === 'notes' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('notes')}
        >
          Class Notes
        </button>
        <button 
          className={`btn ${activeTab === 'deadlines' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('deadlines')}
        >
          Class Deadlines
        </button>
      </div>

      {activeTab === 'notes' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ color: '#2c3e50' }}>Class Notes</h3>
            <button 
              className="btn btn-primary" 
              onClick={() => {
                setShowNoteForm(!showNoteForm);
                if (showNoteForm) {
                  setEditingNote(null);
                  setNoteFormData({ title: '', content: '', fileName: '', fileUrl: '' });
                }
              }}
            >
              {showNoteForm ? 'Cancel' : '+ Add Note'}
            </button>
          </div>

          {showNoteForm && (
            <div className="card">
              <h3>{editingNote ? 'Edit Note' : 'Add New Class Note'}</h3>
              <form onSubmit={handleNoteSubmit}>
                <div className="form-group">
                  <label htmlFor="note-title">Note Title *</label>
                  <input
                    type="text"
                    id="note-title"
                    value={noteFormData.title}
                    onChange={(e) => setNoteFormData({ ...noteFormData, title: e.target.value })}
                    placeholder="Enter note title"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="note-content">Content *</label>
                  <textarea
                    id="note-content"
                    value={noteFormData.content}
                    onChange={(e) => setNoteFormData({ ...noteFormData, content: e.target.value })}
                    placeholder="Write the class note here..."
                    required
                    style={{ minHeight: '150px' }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="note-file">Attachment (Optional)</label>
                  <input
                    type="file"
                    id="note-file"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setNoteFormData(prev => ({ ...prev, fileName: file.name, fileUrl: reader.result }));
                        };
                        reader.readAsDataURL(file);
                      } else {
                        setNoteFormData(prev => ({ ...prev, fileName: '', fileUrl: '' }));
                      }
                    }}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  {editingNote ? 'Update Note' : 'Post Note'}
                </button>
              </form>
            </div>
          )}

          {classNotes.length === 0 ? (
            <div className="empty-state">
              <p>No class notes posted yet. Click "Add Note" to post one.</p>
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
                  <div className="list-actions">
                    <button 
                      className="btn btn-secondary btn-small" 
                      onClick={() => handleEditNote(note)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-danger btn-small" 
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'deadlines' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ color: '#2c3e50' }}>Class Deadlines</h3>
            <button 
              className="btn btn-primary" 
              onClick={() => {
                setShowDeadlineForm(!showDeadlineForm);
                if (showDeadlineForm) {
                  setEditingDeadline(null);
                  setDeadlineFormData({ title: '', description: '', deadline: '', subject: '', fileName: '', fileUrl: '' });
                }
              }}
            >
              {showDeadlineForm ? 'Cancel' : '+ Add Deadline'}
            </button>
          </div>

          {showDeadlineForm && (
            <div className="card">
              <h3>{editingDeadline ? 'Edit Deadline' : 'Add New Class Deadline'}</h3>
              <form onSubmit={handleDeadlineSubmit}>
                <div className="form-group">
                  <label htmlFor="deadline-title">Title *</label>
                  <input
                    type="text"
                    id="deadline-title"
                    value={deadlineFormData.title}
                    onChange={(e) => setDeadlineFormData({ ...deadlineFormData, title: e.target.value })}
                    placeholder="e.g., Assignment Submission"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="deadline-description">Description</label>
                  <textarea
                    id="deadline-description"
                    value={deadlineFormData.description}
                    onChange={(e) => setDeadlineFormData({ ...deadlineFormData, description: e.target.value })}
                    placeholder="Deadline details..."
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="deadline-subject">Subject</label>
                  <input
                    type="text"
                    id="deadline-subject"
                    value={deadlineFormData.subject}
                    onChange={(e) => setDeadlineFormData({ ...deadlineFormData, subject: e.target.value })}
                    placeholder="e.g., Data Structures"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="deadline-date">Deadline Date & Time *</label>
                  <input
                    type="datetime-local"
                    id="deadline-date"
                    value={deadlineFormData.deadline}
                    onChange={(e) => setDeadlineFormData({ ...deadlineFormData, deadline: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="deadline-file">Attachment (Optional)</label>
                  <input
                    type="file"
                    id="deadline-file"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setDeadlineFormData(prev => ({ ...prev, fileName: file.name, fileUrl: reader.result }));
                        };
                        reader.readAsDataURL(file);
                      } else {
                        setDeadlineFormData(prev => ({ ...prev, fileName: '', fileUrl: '' }));
                      }
                    }}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  {editingDeadline ? 'Update Deadline' : 'Post Deadline'}
                </button>
              </form>
            </div>
          )}

          {classDeadlines.length === 0 ? (
            <div className="empty-state">
              <p>No class deadlines posted yet. Click "Add Deadline" to post one.</p>
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
                  <div className="list-actions">
                    <button 
                      className="btn btn-secondary btn-small" 
                      onClick={() => handleEditDeadline(deadline)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-danger btn-small" 
                      onClick={() => handleDeleteDeadline(deadline.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ClassSpaceCR;
