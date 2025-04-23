import React from "react";
import ProgressCalendar from "./ProgressCalendar";

const CalendarPage = ({ completedDates }) => {
  return (
    <div>
      <h2 style={{ textAlign: "center", margin: "1rem 0" }}>Your Habit Calendar</h2>
      <ProgressCalendar completedDates={completedDates} />
    </div>
  );
};

export default CalendarPage;