import React, { useState } from "react";
import ProgressCalendar from "./ProgressCalendar";
import WeeklyProgress from "./WeeklyProgress";
import calendarDecoration1 from '../assets/calendar-decoration1.jpg';
import calendarDecoration2 from '../assets/calendar-decoration2.jpg';
import calendarDecoration3 from '../assets/calendar-decoration3.jpg';
import QuotesManager from './QuotesManager';
import './CalendarPage.css';

const CalendarPage = ({ completedDates }) => {
  const [eventMarkers, setEventMarkers] = useState({});

  const handleAddMarker = (date, marker) => {
    const dateString = date.toDateString();
    setEventMarkers(prev => ({
      ...prev,
      [dateString]: [...(prev[dateString] || []), marker]
    }));
  };

  return (
    <div className="calendar-page">
      <div className="calendar-header">
        <h2>Your Habit Journey</h2>
        <p className="calendar-subtitle">Track your progress and celebrate your wins! 🎯</p>
      </div>
      
      <div className="calendar-layout">
        <div className="calendar-decoration left">
          <img src={calendarDecoration1} alt="Planning" className="decoration-image" />
          <div className="motivation-quote">
            <QuotesManager type="daily" />
          </div>
        </div>

        <div className="calendar-main">
          <ProgressCalendar 
            completedDates={completedDates} 
            eventMarkers={eventMarkers}
            onAddMarker={handleAddMarker}
          />
          <WeeklyProgress completedDates={completedDates} />
          <div className="calendar-stats">
            <div className="stat-item">
              <span className="stat-emoji">🎯</span>
              <span className="stat-value">{completedDates.length}</span>
              <span className="stat-label">Days Completed</span>
            </div>
            <div className="stat-item">
              <span className="stat-emoji">🔥</span>
              <span className="stat-value">
                {completedDates.filter(date => {
                  const d = new Date(date);
                  const now = new Date();
                  return d.getMonth() === now.getMonth();
                }).length}
              </span>
              <span className="stat-label">This Month</span>
            </div>
            <div className="stat-item">
              <span className="stat-emoji">⭐</span>
              <span className="stat-value">
                {Math.floor((completedDates.length / 365) * 100)}%
              </span>
              <span className="stat-label">Year Progress</span>
            </div>
          </div>
        </div>

        <div className="calendar-decoration right">
          <img src={calendarDecoration2} alt="Organization" className="decoration-image" />
          <div className="habit-tips">
            <h3>💡 Habit Tips</h3>
            <ul>
              <li>Start small, think big</li>
              <li>Be consistent</li>
              <li>Track your progress</li>
              <li>Celebrate small wins</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="calendar-footer">
        <img src={calendarDecoration3} alt="Planning calendar" className="footer-image" />
        <div className="footer-message">
          Keep going! Every day is a new opportunity to grow. 🌱
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;