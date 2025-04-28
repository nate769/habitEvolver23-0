import React from 'react';
import './WeeklyProgress.css';

const WeeklyProgress = ({ completedDates = [] }) => {
  const getWeeklyCompletionData = () => {
    const today = new Date();
    const last7Days = Array.from({length: 7}, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const dailyCompletions = last7Days.map(date => {
      const completions = completedDates.filter(completedDate => 
        completedDate === date
      ).length;
      
      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        completions
      };
    });

    return dailyCompletions;
  };

  const weeklyData = getWeeklyCompletionData();
  const maxCompletions = Math.max(...weeklyData.map(day => day.completions), 1);

  return (
    <div className="weekly-progress">
      <h3>Weekly Progress</h3>
      <div className="weekly-chart">
        {weeklyData.map((day, index) => (
          <div key={index} className="day-column">
            <div className="bar-container">
              <div 
                className="progress-bar"
                style={{
                  height: `${(day.completions / maxCompletions) * 100}%`,
                  backgroundColor: day.completions > 0 ? '#3498db' : '#e0e0e0'
                }}
              >
                <span className="completion-count">{day.completions}</span>
              </div>
            </div>
            <div className="day-label">{day.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyProgress; 