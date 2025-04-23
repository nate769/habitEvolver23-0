// ProgressCalendar.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './ProgressCalendar.css'; // for custom styles

function ProgressCalendar({ completedDates, onError }) {
  const [value, setValue] = useState(new Date());

  useEffect(() => {
    try {
      const formattedCompleted = completedDates.map(date => {
        const parsed = new Date(date);
        if (isNaN(parsed.getTime())) {
          throw new Error(`Invalid date format: ${date}`);
        }
        return parsed.toDateString();
      });
    } catch (error) {
      onError?.(error);
    }
  }, [completedDates, onError]);

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toDateString();
      if (completedDates.includes(dateString)) {
        return (
          <div 
            className="mark-x"
            role="img" 
            aria-label="Completed"
          >
            X
          </div>
        );
      }
    }
    return null;
  };

  const handleDateChange = (newValue) => {
    try {
      setValue(newValue);
    } catch (error) {
      onError?.(error);
    }
  };

  return (
    <div 
      className="calendar-container" 
      role="region" 
      aria-label="Progress Calendar"
    >
      <h3>Habit Progress</h3>
      <Calendar
        onChange={handleDateChange}
        value={value}
        tileContent={tileContent}
        locale="en-US"
        aria-label="Select Date"
      />
      <div className="calendar-legend" role="note">
        <div className="legend-item">
          <span className="mark-x" role="img" aria-label="X mark">X</span>
          <span>: Completed</span>
        </div>
      </div>
    </div>
  );
}

ProgressCalendar.propTypes = {
  completedDates: PropTypes.arrayOf(PropTypes.string).isRequired,
  onError: PropTypes.func
};

ProgressCalendar.defaultProps = {
  onError: () => {}
};

export default ProgressCalendar;
