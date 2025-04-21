// src/components/GoalBox.jsx
import { useState, useEffect } from 'react';
import './GoalBox.css';
import AlarmFeature from './AlarmFeature';

function GoalBox({ setDailyPoints, goals, setGoals }) {
  const [newGoal, setNewGoal] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('09:00');

  useEffect(() => {
    const savedGoals = localStorage.getItem('goals');
    if (savedGoals) setGoals(JSON.parse(savedGoals));
  }, []);

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  const handleAdd = () => {
    const trimmed = newGoal.trim();
    if (!trimmed) return;
    setGoals([...goals, { text: trimmed, date: newDate, time: newTime, completed: false, taskStreak: 0 }]);
    setNewGoal('');
    setNewDate('');
    setNewTime('09:00');
  };

  const handleRemove = (index) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  const handleDateChange = (index, value) => {
    setGoals(goals.map((g, i) => (i === index ? { ...g, date: value } : g)));
  };

  const handleTimeChange = (index, value) => {
    setGoals(goals.map((g, i) => (i === index ? { ...g, time: value } : g)));
  };

  const handleToggleComplete = (index) => {
    const today = new Date().toISOString().split('T')[0];
    setGoals((prevGoals) => {
      const updatedGoals = [...prevGoals];
      const goal = updatedGoals[index];
      const isCompletedToday = goal.completed && goal.lastCompleted === today;
      if (!isCompletedToday) {
        goal.completed = !goal.completed;
        if (goal.completed) {
          goal.lastCompleted = today;
          goal.taskStreak += 1;
          setDailyPoints((prev) => prev + 10);
        } else {
          goal.taskStreak = 0;
        }
      }
      return updatedGoals;
    });
  };

  return (
    <div className="goal-box">
      <h2 className="goal-box__heading">Your Goals</h2>
      <ul className="goal-box__list">
        {goals.map((goal, i) => (
          <li key={i} className="goal-box__item">
            <span className="goal-box__text">
              <input
                type="checkbox"
                checked={goal.completed}
                onChange={() => handleToggleComplete(i)}
              />
              {goal.text}
            </span>
            <input
              type="date"
              value={goal.date}
              onChange={(e) => handleDateChange(i, e.target.value)}
              className="goal-box__date"
            />
            <input
              type="time"
              value={goal.time}
              onChange={(e) => handleTimeChange(i, e.target.value)}
              className="goal-box__time"
            />
            <div className="task-streak">🔥 {goal.taskStreak}</div>
            <button className="goal-box__remove" onClick={() => handleRemove(i)}>
              ×
            </button>
            <AlarmFeature task={{ text: goal.text, date: goal.date, time: goal.time }} />
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
        <button onClick={handleAdd} className="goal-box__add-btn">
          Add
        </button>
      </div>
    </div>
  );
}

export default GoalBox;