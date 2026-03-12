import React, { useState, useEffect } from 'react';
import { notesAPI } from '../services/api';

function PersonalNotes() {
  const [notes, setNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    fileName: '',
    fileUrl: ''
  });

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const data = await notesAPI.getMyNotes();
        setNotes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load notes', err);
      }
    };

    fetchNotes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      alert('Please fill in both title and content');
      return;
    }

    try {
      const dataToSend = { title: formData.title, content: formData.content };
      if (formData.fileUrl) {
          dataToSend.attachments = [{
              fileName: formData.fileName,
              fileUrl: formData.fileUrl,
              uploadedAt: new Date()
          }];
      }

      const res = await notesAPI.createNote(dataToSend);
      const created = res && res.note ? res.note : null;
      if (created) {
        setNotes(prev => [created, ...prev]);
      }
      setFormData({ title: '', content: '', fileName: '', fileUrl: '' });
      setShowForm(false);
    } catch (err) {
      console.error('Create note failed', err);
      alert(err.message || 'Failed to create note');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await notesAPI.deleteNote(id);
        const updated = notes.filter(n => n._id !== id);
        setNotes(updated);
      } catch (err) {
        console.error('Delete failed', err);
        alert(err.message || 'Failed to delete note');
      }
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#2c3e50' }}>Personal Notes</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Note'}
        </button>
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <h3>Happiness Journal Ideas</h3>
        <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '10px' }}>
          Use notes as your happiness journal and PSDA book summary space.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <button
            type="button"
            className="btn btn-secondary btn-small"
            onClick={() => {
              setFormData(prev => ({ 
                ...prev, 
                title: 'Module 1 – Body Reflections', 
                content: 'How did today’s body‑relaxation practices (e.g., Yog Nidra, breathing, stretching) affect my mood, energy and sleep?\n\nWrite your reflections here.' 
              }));
              setShowForm(true);
            }}
          >
            🌿 Add “Body Reflections” note
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-small"
            onClick={() => {
              setFormData(prev => ({ 
                ...prev, 
                title: 'Module 2 – Mind Reflections', 
                content: 'How did mental‑discipline tools (SCV formula, happy self‑talks, anger‑trigger mind map) show up in my day?\n\nWrite your reflections here.' 
              }));
              setShowForm(true);
            }}
          >
            🧠 Add “Mind Reflections” note
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-small"
            onClick={() => {
              setFormData(prev => ({ 
                ...prev, 
                title: 'Digital Minimalism – Summary & Insights', 
                content: 'Summarise key ideas from “Digital Minimalism” and how you will apply them to your own digital‑detox habits.' 
              }));
              setShowForm(true);
            }}
          >
            📘 Add “Digital Minimalism” summary
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card">
          <h3>Add New Note</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Note Title *</label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter note title"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="content">Content *</label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your note here..."
                required
                style={{ minHeight: '150px' }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="file">Attachment (Optional)</label>
              <input
                type="file"
                id="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setFormData(prev => ({ ...prev, fileName: file.name, fileUrl: reader.result }));
                    };
                    reader.readAsDataURL(file);
                  } else {
                    setFormData(prev => ({ ...prev, fileName: '', fileUrl: '' }));
                  }
                }}
              />
            </div>
            <button type="submit" className="btn btn-primary">Save Note</button>
          </form>
        </div>
      )}

      {notes.length === 0 ? (
        <div className="empty-state">
          <p>No notes yet. Click "Add Note" to create your first note.</p>
        </div>
      ) : (
        <div>
          {notes.map(note => (
            <div key={note._id || note.id} className="list-item">
              <h4>{note.title}</h4>
              <p style={{ whiteSpace: 'pre-wrap', marginBottom: '10px' }}>{note.content}</p>
              {note.attachments && note.attachments.length > 0 && (
                  <div style={{ marginTop: '5px', marginBottom: '10px' }}>
                    <strong>Attachment: </strong>
                    <a href={note.attachments[0].fileUrl} download={note.attachments[0].fileName} target="_blank" rel="noopener noreferrer" style={{ color: '#3498db', textDecoration: 'none' }}>
                      {note.attachments[0].fileName || 'View Document'} 📎
                    </a>
                  </div>
              )}
              <p style={{ fontSize: '12px', color: '#95a5a6' }}>
                Created: {new Date(note.createdAt || note.createdAt).toLocaleString()}
              </p>
              <div className="list-actions">
                <button 
                  className="btn btn-danger btn-small" 
                  onClick={() => handleDelete(note._id || note.id)}
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

export default PersonalNotes;
