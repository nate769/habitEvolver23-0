import React, { useState, useEffect } from 'react';
import './GoalBox.css';
import AlarmFeature from './AlarmFeature';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function GoalBox({ setDailyPoints, goals, setGoals }) {
  const [newGoal, setNewGoal] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const [selectedPriority, setSelectedPriority] = useState('all');

  useEffect(() => {
    const savedGoals = localStorage.getItem('goals');
    if (savedGoals) {
      const parsedGoals = JSON.parse(savedGoals);
      // Ensure all goals have a priority
      const goalsWithPriority = parsedGoals.map(goal => ({
        ...goal,
        priority: goal.priority || 'medium' // Default to medium if priority is missing
      }));
      setGoals(goalsWithPriority);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  const handleAdd = () => {
    if (newGoal.trim()) {
      const newGoalObj = {
        text: newGoal,
        date: newDate,
        time: newTime,
        completed: false,
        taskStreak: 0,
        position: 'right',
        priority: newPriority,
        completionHistory: [],
        longestStreak: 0
      };
      setGoals([...goals, newGoalObj]);
      setNewGoal('');
      setNewDate('');
      setNewTime('');
      setNewPriority('medium');
    }
  };

  const handleToggle = (index) => {
    const updatedGoals = [...goals];
    const goal = updatedGoals[index];
    
    goal.completed = !goal.completed;
    
    if (goal.completed) {
      goal.position = 'left';
      setDailyPoints(prev => prev + 10);
      goal.taskStreak += 1;
      goal.longestStreak = Math.max(goal.longestStreak || 0, goal.taskStreak);
      goal.completionHistory = [
        ...(goal.completionHistory || []),
        new Date().toISOString()
      ];
    } else {
      goal.position = 'right';
      setDailyPoints(prev => Math.max(0, prev - 10));
      goal.taskStreak = Math.max(0, goal.taskStreak - 1);
    }
    
    setGoals(updatedGoals);
  };

  const handleDelete = (index) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ff4757';
      case 'medium': return '#ffa502';
      case 'low': return '#2ed573';
      default: return '#ffa502';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '🟡';
    }
  };

  const filteredGoals = selectedPriority === 'all' 
    ? goals 
    : goals.filter(goal => goal.priority === selectedPriority);

  const getWeeklyCompletionData = () => {
    const today = new Date();
    const last7Days = Array.from({length: 7}, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const dailyCompletions = last7Days.map(date => {
      const completions = goals.reduce((count, goal) => {
        return count + (goal.completionHistory?.some(hist => 
          new Date(hist).toISOString().split('T')[0] === date
        ) ? 1 : 0);
      }, 0);
      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        completions
      };
    });

    return dailyCompletions;
  };

  return (
    <div className="goal-box">
      <h3 className="goal-box__heading">Your Goals</h3>
      
      <div className="goal-box__chart">
        <h4>Weekly Progress</h4>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={getWeeklyCompletionData()} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="completions" 
              stroke="#3a7bd5" 
              strokeWidth={2}
              dot={{ fill: '#3a7bd5' }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="goal-box__filters">
        <button 
          onClick={() => setSelectedPriority('all')}
          className={`filter-btn ${selectedPriority === 'all' ? 'active' : ''}`}
        >
          All
        </button>
        <button 
          onClick={() => setSelectedPriority('high')}
          className={`filter-btn ${selectedPriority === 'high' ? 'active' : ''}`}
        >
          High Priority
        </button>
        <button 
          onClick={() => setSelectedPriority('medium')}
          className={`filter-btn ${selectedPriority === 'medium' ? 'active' : ''}`}
        >
          Medium Priority
        </button>
        <button 
          onClick={() => setSelectedPriority('low')}
          className={`filter-btn ${selectedPriority === 'low' ? 'active' : ''}`}
        >
          Low Priority
        </button>
      </div>

      <ul className="goal-box__list">
        {filteredGoals.map((goal, index) => (
          <li key={index} className={`goal-box__item ${goal.completed ? 'completed' : ''} ${goal.position}`}>
            <div className="goal-box__text">
              <input
                type="checkbox"
                checked={goal.completed}
                onChange={() => handleToggle(index)}
                className="goal-box__checkbox"
              />
              <span>{goal.text}</span>
            </div>
            <div className="goal-box__meta">
              {goal.date && (
                <div className="goal-box__datetime">
                  <span className="goal-box__date">{goal.date}</span>
                  {goal.time && <span className="goal-box__time">{goal.time}</span>}
                </div>
              )}
              <div className="goal-box__streak">
                <span className="task-streak" title="Current Streak">
                  🔥 {goal.taskStreak}
                </span>
                {goal.longestStreak > 0 && (
                  <span className="best-streak" title="Best Streak">
                    ⭐ {goal.longestStreak}
                  </span>
                )}
              </div>
              <span 
                className="priority-badge"
                style={{ backgroundColor: getPriorityColor(goal.priority || 'medium') }}
                title={`${(goal.priority || 'medium').charAt(0).toUpperCase() + (goal.priority || 'medium').slice(1)} Priority`}
              >
                {getPriorityIcon(goal.priority || 'medium')}
              </span>
            </div>
            {goal.completionHistory && goal.completionHistory.length > 0 && (
              <div className="completion-timeline">
                {goal.completionHistory.slice(-5).map((date, i) => (
                  <span 
                    key={i} 
                    className="completion-dot"
                    title={new Date(date).toLocaleDateString()}
                  >✓</span>
                ))}
              </div>
            )}
            <button 
              onClick={() => handleDelete(index)}
              className="goal-box__delete-btn"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      <div className="goal-box__form">
        <input
          type="text"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          className="goal-box__input"
          placeholder="Add new goal..."
        />
        <div className="goal-box__datetime-inputs">
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="goal-box__date"
          />
          <input
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className="goal-box__time"
          />
          <select 
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value)}
            className="goal-box__priority"
          >
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
        <button onClick={handleAdd} className="goal-box__add-btn">
          Add Goal
        </button>
      </div>
    </div>
  );
}

export default GoalBox;