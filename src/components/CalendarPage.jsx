import React, { useState } from "react";
import PropTypes from 'prop-types';
import ProgressCalendar from "./ProgressCalendar";

const CalendarPage = ({ completedDates }) => {
  const [error, setError] = useState(null);

  if (error) {
    return (
      <div role="alert" className="error-boundary">
        <h2>Something went wrong with the calendar.</h2>
        <button onClick={() => setError(null)}>Try again</button>
      </div>
    );
  }

  return (
    <div role="main" aria-label="Habit Calendar Page">
      <h2 style={{ textAlign: "center", margin: "1rem 0" }}>Your Habit Calendar</h2>
      <div aria-live="polite">
        <ProgressCalendar 
          completedDates={completedDates} 
          onError={(e) => setError(e)}
        />
      </div>
    </div>
  );
};

CalendarPage.propTypes = {
  completedDates: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default CalendarPage;