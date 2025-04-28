import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './ProgressCalendar.css'; 

function ProgressCalendar({ completedDates, eventMarkers = {}, onAddMarker }) {
  const [value, setValue] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showMarkerInput, setShowMarkerInput] = useState(false);
  const [markerInput, setMarkerInput] = useState('');

  const commonEmojis = [
    '🎯', '📚', '🏋️', '🎉', '📝', '💪', '🎨', '🎵', 
    '🏃', '🧘', '🍎', '💧', '📱', '💻', '🎮', '📖'
  ];

  const formattedCompleted = completedDates.map(date =>
    new Date(date).toDateString()
  );

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowMarkerInput(true);
    setMarkerInput('');
  };

  const handleAddMarker = () => {
    if (markerInput.trim()) {
      onAddMarker(selectedDate, markerInput);
      setShowMarkerInput(false);
      setMarkerInput('');
    }
  };

  const handleEmojiClick = (emoji) => {
    setMarkerInput(prev => prev + emoji);
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toDateString();
      const markers = [];
      
      // Add completion marker
      if (formattedCompleted.includes(dateString)) {
        markers.push(<div key="completed" className="mark-x">🎯</div>);
      }
      
      // Add event markers
      if (eventMarkers[dateString]) {
        eventMarkers[dateString].forEach((marker, index) => {
          markers.push(
            <div key={`event-${index}`} className="event-marker" title={marker}>
              {marker}
            </div>
          );
        });
      }
      
      return markers.length > 0 ? (
        <div className="markers-container">
          {markers}
        </div>
      ) : null;
    }
    return null;
  };

  return (
    <div className="calendar-container">
      <h3>Habit Progress</h3>
      <Calendar
        onChange={setValue}
        value={value}
        tileContent={tileContent}
        onClickDay={handleDateClick}
      />
      
      {showMarkerInput && (
        <div className="marker-input-container">
          <div className="emoji-picker">
            {commonEmojis.map((emoji, index) => (
              <button
                key={index}
                className="emoji-button"
                onClick={() => handleEmojiClick(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={markerInput}
            onChange={(e) => setMarkerInput(e.target.value)}
            placeholder="Enter emoji or text..."
            className="marker-input"
          />
          <div className="marker-buttons">
            <button onClick={handleAddMarker} className="add-marker-btn">
              Add
            </button>
            <button onClick={() => setShowMarkerInput(false)} className="cancel-marker-btn">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProgressCalendar;
