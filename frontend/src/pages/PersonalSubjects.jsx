import React, { useState, useEffect } from 'react';
import { subjectsAPI } from '../services/api';

function PersonalSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    professor: '',
    credits: ''
  });

  const syncSubjects = (list) => {
    setSubjects(list);
    try {
      localStorage.setItem('subjects', JSON.stringify(list));
    } catch (e) {
      console.error('Failed to sync subjects to localStorage', e);
    }
  };

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await subjectsAPI.getAllSubjects();
        const list = Array.isArray(data) ? data : [];
        syncSubjects(list);
      } catch (err) {
        console.error('Failed to load subjects', err);
      }
    };

    fetchSubjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.code) {
      alert('Please fill in at least name and code');
      return;
    }

    try {
      const res = await subjectsAPI.createSubject(formData);
      const created = res && res.subject ? res.subject : null;
      if (created) {
        syncSubjects([created, ...subjects]);
      }
    } catch (err) {
      console.error('Create subject failed', err);
      alert(err.message || 'Failed to create subject');
      return;
    }
    
    setFormData({ name: '', code: '', professor: '', credits: '' });
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await subjectsAPI.deleteSubject(id);
        const updated = subjects.filter(s => (s._id || s.id) !== id);
        syncSubjects(updated);
      } catch (err) {
        console.error('Delete failed', err);
        alert(err.message || 'Failed to delete subject');
      }
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#2c3e50' }}>My Subjects</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Subject'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h3>Add New Subject</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Subject Name *</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Data Structures"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="code">Subject Code *</label>
              <input
                type="text"
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g., CS301"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="professor">Professor Name</label>
              <input
                type="text"
                id="professor"
                value={formData.professor}
                onChange={(e) => setFormData({ ...formData, professor: e.target.value })}
                placeholder="e.g., Dr. John Smith"
              />
            </div>
            <div className="form-group">
              <label htmlFor="credits">Credits</label>
              <input
                type="number"
                id="credits"
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                placeholder="e.g., 3"
              />
            </div>
            <button type="submit" className="btn btn-primary">Add Subject</button>
          </form>
        </div>
      )}

      {subjects.length === 0 ? (
        <div className="empty-state">
          <p>No subjects added yet. Click "Add Subject" to get started.</p>
        </div>
      ) : (
        <div className="grid">
          {subjects.map(subject => (
            <div key={subject._id || subject.id} className="card">
              <h3>{subject.name}</h3>
              <p><strong>Code:</strong> {subject.code}</p>
              {subject.professor && <p><strong>Professor:</strong> {subject.professor}</p>}
              {subject.credits && <p><strong>Credits:</strong> {subject.credits}</p>}
              <button 
                className="btn btn-danger btn-small" 
                onClick={() => handleDelete(subject._id || subject.id)}
                style={{ marginTop: '10px' }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PersonalSubjects;
