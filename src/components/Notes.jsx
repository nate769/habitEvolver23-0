import React, { useState, useEffect } from 'react';
import './Notes.css';
import notesIllustration from '../assets/placeholders/image.png';

const Notes = () => {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('habitNotes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  const [newNote, setNewNote] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('general');

  const categories = [
    { id: 'general', label: 'General', icon: '📝' },
    { id: 'fitness', label: 'Fitness', icon: '💪' },
    { id: 'study', label: 'Study', icon: '📚' },
    { id: 'mindfulness', label: 'Mindfulness', icon: '🧘' },
    { id: 'nutrition', label: 'Nutrition', icon: '🥗' }
  ];

  useEffect(() => {
    localStorage.setItem('habitNotes', JSON.stringify(notes));
  }, [notes]);

  const handleAddNote = (e) => {
    e.preventDefault();
    if (newNote.trim()) {
      const note = {
        id: Date.now(),
        text: newNote,
        category: selectedCategory,
        date: new Date().toISOString(),
        icon: categories.find(cat => cat.id === selectedCategory)?.icon
      };
      setNotes([note, ...notes]);
      setNewNote('');
    }
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="notes-container">
      <h2>Habit Notes</h2>
      <img src={notesIllustration} alt="Notes Illustration" className="notes-illustration-bg" />
      <form onSubmit={handleAddNote} className="notes-form">
        <div className="category-selector">
          {categories.map(category => (
            <button
              key={category.id}
              type="button"
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.icon} {category.label}
            </button>
          ))}
        </div>
        <div className="input-group">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Write your note here..."
            rows="3"
          />
          <button type="submit" className="add-note-btn">
            Add Note
          </button>
        </div>
      </form>
      <div className="notes-list-section">
        {notes.length === 0 ? (
          <div className="notes-empty-state">
            <img src={notesIllustration} alt="No notes yet" className="notes-empty-img" />
            <p className="notes-empty-text">No notes yet. Start by adding your first note!</p>
          </div>
        ) : (
          <div className="notes-list">
            {notes.map(note => (
              <div key={note.id} className="note-card">
                <div className="note-header">
                  <span className="note-category">
                    {note.icon} {categories.find(cat => cat.id === note.category)?.label}
                  </span>
                  <span className="note-date">{formatDate(note.date)}</span>
                </div>
                <p className="note-text">{note.text}</p>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="delete-note-btn"
                  aria-label="Delete note"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;