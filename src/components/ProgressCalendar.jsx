// ProgressCalendar.jsx
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './ProgressCalendar.css'; // for custom styles

function ProgressCalendar({ completedDates }) {
  const [value, setValue] = useState(new Date());

  // Convert all completedDates to string format for matching
  const formattedCompleted = completedDates.map(date =>
    new Date(date).toDateString()
  );

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toDateString();
      if (formattedCompleted.includes(dateString)) {
        return <div className="mark-x">X</div>;
      }
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
      />
    </div>
  );
}

export default ProgressCalendar;
