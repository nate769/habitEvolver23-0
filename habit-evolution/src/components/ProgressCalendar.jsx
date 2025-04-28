import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './ProgressCalendar.css';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-date">{label}</p>
        <p className="tooltip-value">
          {payload[0].value} goals completed
        </p>
      </div>
    );
  }
  return null;
};

function WeeklyProgress({ data }) {
  return (
    <div className="weekly-progress">
      <h3>Weekly Progress</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <XAxis 
            dataKey="date" 
            label={{ 
              value: 'Days', 
              position: 'bottom', 
              offset: 0 
            }}
          />
          <YAxis 
            label={{ 
              value: 'Completed Goals', 
              angle: -90, 
              position: 'insideLeft',
              offset: 10
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="completed" 
            stroke="var(--primary)" 
            strokeWidth={2}
            dot={{ fill: 'var(--primary)', strokeWidth: 2 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function ProgressCalendar({ completedDates }) {
  const [value, setValue] = useState(new Date());
  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    const getWeeklyCompletionData = () => {
      const today = new Date();
      const last7Days = Array.from({length: 7}, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      const dailyCompletions = last7Days.map(date => {
        const completions = completedDates.filter(hist => 
          new Date(hist).toISOString().split('T')[0] === date
        ).length;
        return {
          date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
          completed: completions
        };
      });

      setWeeklyData(dailyCompletions);
    };

    getWeeklyCompletionData();
  }, [completedDates]);

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
      <div className="progress-layout">
        <div className="calendar-section">
          <Calendar
            onChange={setValue}
            value={value}
            tileContent={tileContent}
          />
        </div>
        <div className="weekly-section">
          <WeeklyProgress data={weeklyData} />
        </div>
      </div>
    </div>
  );
}

export default ProgressCalendar;
