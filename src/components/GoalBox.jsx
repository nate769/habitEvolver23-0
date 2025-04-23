import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './GoalBox.css';
import AlarmFeature from './AlarmFeature';

function GoalBox({ setDailyPoints, goals, setGoals }) {
  const [newGoal, setNewGoal] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('09:00');
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const savedGoals = localStorage.getItem('goals');
      if (savedGoals) {
        const parsedGoals = JSON.parse(savedGoals);
        if (Array.isArray(parsedGoals)) {
          setGoals(parsedGoals);
        } else {
          throw new Error('Saved goals is not an array');
        }
      }
    } catch (error) {
      setError('Error loading goals: ' + error.message);
      console.error('Error loading goals from localStorage:', error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('goals', JSON.stringify(goals));
    } catch (error) {
      setError('Error saving goals: ' + error.message);
      console.error('Error saving goals to localStorage:', error);
    }
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
    const trimmed = newGoal.trim();
    if (!trimmed) return;
    const formattedDate = formatDateForStorage(newDate);
    setGoals([...goals, { text: trimmed, date: formattedDate, time: newTime, completed: false, taskStreak: 0, lastCompleted: '' }]);
    setNewGoal('');
    setNewDate('');
    setNewTime('09:00');
  };

  const handleRemove = (index) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  const handleDateChange = (index, value) => {
    const formattedDate = formatDateForStorage(value);
    setGoals(goals.map((g, i) => (i === index ? { ...g, date: formattedDate } : g)));
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
          setDailyPoints((prev) => Math.max(0, prev - 10));
        }
      }
      return updatedGoals;
    });
  };

  return (
    <div className="goal-box">
      <h2 className="goal-box__heading">Your Goals</h2>
      {error && <div className="error">{error}</div>}
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
              value={formatDateForInput(goal.date)}
              onChange={(e) => handleDateChange(i, e.target.value)}
              className="goal-box__date"
            />
            <input
              type="time"
              value={goal.time || '09:00'}
              onChange={(e) => handleTimeChange(i, e.target.value)}
              className="goal-box__time"
            />
            <div className="task-streak">🔥 {goal.taskStreak}</div>
            <button className="goal-box__remove" onClick={() => handleRemove(i)}>
              ×
            </button>
            <AlarmFeature task={{ text: goal.text, date: goal.date, time: goal.time || '09:00' }} />
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

GoalBox.propTypes = {
  setDailyPoints: PropTypes.func.isRequired,
  goals: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    date: PropTypes.string,
    time: PropTypes.string,
    completed: PropTypes.bool.isRequired,
    taskStreak: PropTypes.number.isRequired,
    lastCompleted: PropTypes.string
  })).isRequired,
  setGoals: PropTypes.func.isRequired
};

export default GoalBox;