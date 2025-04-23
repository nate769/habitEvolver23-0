import React, { useState, useEffect } from 'react';
import './GoalBox.css';
import AlarmFeature from './AlarmFeature';

function GoalBox({ setDailyPoints, goals, setGoals }) {
  const [newGoal, setNewGoal] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  useEffect(() => {
    const savedGoals = localStorage.getItem('goals');
    if (savedGoals) setGoals(JSON.parse(savedGoals));
  }, []);

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  const formatDateForStorage = (date) => {
    if (!date) return '';
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
  };

  const formatDateForInput = (date) => {
    if (!date) return '';
    const [day, month, year] = date.split('-');
    return `${year}-${month}-${day}`;
  };

  const handleAdd = () => {
    if (newGoal.trim()) {
      const newGoalObj = {
        text: newGoal,
        date: newDate,
        time: newTime,
        completed: false,
        taskStreak: 0,
        position: 'right'
      };
      setGoals([...goals, newGoalObj]);
      setNewGoal('');
      setNewDate('');
      setNewTime('');
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
    } else {
      goal.position = 'right';
      setDailyPoints(prev => Math.max(0, prev - 10));
      goal.taskStreak = Math.max(0, goal.taskStreak - 1);
    }
    
    setGoals(updatedGoals);
  };

  const handleDelete = (index) => {
    const updatedGoals = goals.filter((_, i) => i !== index);
    setGoals(updatedGoals);
  };

  return (
    <div className="goal-box">
      <h3 className="goal-box__heading">Your Goals</h3>
      <ul className="goal-box__list">
        {goals.map((goal, index) => (
          <li 
            key={index} 
            className={`goal-box__item ${goal.completed ? 'completed' : ''} ${goal.position}`}
          >
            <div className="goal-box__text">
              <input
                type="checkbox"
                checked={goal.completed}
                onChange={() => handleToggle(index)}
                className="goal-box__checkbox"
              />
              <span>{goal.text}</span>
            </div>
            {goal.date && (
              <div className="goal-box__datetime">
                <span className="goal-box__date">{goal.date}</span>
                {goal.time && <span className="goal-box__time">{goal.time}</span>}
              </div>
            )}
            <div className="goal-box__streak">
              <span className="task-streak">🔥 {goal.taskStreak}</span>
            </div>
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
        </div>
        <button onClick={handleAdd} className="goal-box__add-btn">
          Add Goal
        </button>
      </div>
    </div>
  );
}

export default GoalBox;