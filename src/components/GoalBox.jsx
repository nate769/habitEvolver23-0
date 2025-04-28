import React, { useState, useEffect } from 'react';
import './GoalBox.css';
import AlarmFeature from './AlarmFeature';
import Confetti from './Confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function GoalBox({ setDailyPoints, goals, setGoals }) {
  const [newGoal, setNewGoal] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [confettiPosition, setConfettiPosition] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    const savedGoals = localStorage.getItem('goals');
    if (savedGoals) {
      const parsedGoals = JSON.parse(savedGoals);
      const goalsWithPriority = parsedGoals.map(goal => ({
        ...goal,
        priority: goal.priority || 'medium'
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

  const handleToggle = (index, event) => {
    const updatedGoals = [...goals];
    const goal = updatedGoals[index];
    const checkbox = event.target;
    const rect = checkbox.getBoundingClientRect();
    
    goal.completed = !goal.completed;
    
    if (goal.completed) {
      goal.position = 'left';
      setDailyPoints(prev => prev + 10);
      goal.taskStreak += 1;

      // Trigger confetti at checkbox position
      setConfettiPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      });

      // Reset confetti after animation
      setTimeout(() => setConfettiPosition(null), 2000);

      goal.longestStreak = Math.max(goal.longestStreak || 0, goal.taskStreak);
      goal.completionHistory = [
        ...(goal.completionHistory || []),
        new Date().toISOString()
      ];

      // Add bounce animation class
      const listItem = event.target.closest('.goal-box__item');
      listItem.classList.add('bounce');
      setTimeout(() => listItem.classList.remove('bounce'), 500);
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

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditValue(goals[index].text);
  };

  const handleEditSave = () => {
    if (editValue.trim()) {
      const updatedGoals = [...goals];
      updatedGoals[editingIndex].text = editValue;
      setGoals(updatedGoals);
    }
    setEditingIndex(null);
  };

  return (
    <motion.div 
      className="goal-box"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {confettiPosition && (
        <Confetti x={confettiPosition.x} y={confettiPosition.y} />
      )}
      <h3 className="goal-box__heading">Your Goals</h3>
      
      <motion.div 
        className="goal-box__filters"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
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
      </motion.div>

      <AnimatePresence mode="popLayout">
        <motion.ul className="goal-box__list">
          {filteredGoals.map((goal, index) => (
            <motion.li
              key={goal.id || index}
              className={`goal-box__item ${goal.completed ? 'completed' : ''} ${goal.position}`}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ 
                type: "spring",
                stiffness: 500,
                damping: 25,
                mass: 0.5
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="goal-box__text">
                <motion.input
                  type="checkbox"
                  checked={goal.completed}
                  onChange={(e) => handleToggle(index, e)}
                  className="goal-box__checkbox"
                  whileTap={{ scale: 0.8 }}
                />
                {editingIndex === index ? (
                  <motion.input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={handleEditSave}
                    onKeyDown={(e) => e.key === 'Enter' && handleEditSave()}
                    className="goal-box__edit-input"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    autoFocus
                  />
                ) : (
                  <motion.span 
                    onDoubleClick={() => handleEdit(index)}
                    whileHover={{ scale: 1.02 }}
                  >
                    {goal.text}
                  </motion.span>
                )}
              </div>
              <motion.div 
                className="goal-box__meta"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {goal.date && (
                  <motion.div 
                    className="goal-box__datetime"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="goal-box__date">{goal.date}</span>
                    {goal.time && <span className="goal-box__time">{goal.time}</span>}
                  </motion.div>
                )}
                <div className="goal-box__streak">
                  <motion.span 
                    className="task-streak" 
                    title="Current Streak"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    🔥 {goal.taskStreak}
                  </motion.span>
                  {goal.longestStreak > 0 && (
                    <motion.span 
                      className="best-streak" 
                      title="Best Streak"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      ⭐ {goal.longestStreak}
                    </motion.span>
                  )}
                </div>
                <motion.span 
                  className="priority-badge"
                  style={{ backgroundColor: getPriorityColor(goal.priority || 'medium') }}
                  title={`${(goal.priority || 'medium').charAt(0).toUpperCase() + (goal.priority || 'medium').slice(1)} Priority`}
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ rotate: { duration: 0.5 } }}
                >
                  {getPriorityIcon(goal.priority || 'medium')}
                </motion.span>
              </motion.div>
              {goal.completionHistory && goal.completionHistory.length > 0 && (
                <motion.div 
                  className="completion-timeline"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {goal.completionHistory.slice(-5).map((date, i) => (
                    <motion.span 
                      key={i} 
                      className="completion-dot"
                      title={new Date(date).toLocaleDateString()}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.2 }}
                    >
                      ✓
                    </motion.span>
                  ))}
                </motion.div>
              )}
              <motion.button 
                onClick={() => handleDelete(index)}
                className="goal-box__delete-btn"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                ×
              </motion.button>
            </motion.li>
          ))}
        </motion.ul>
      </AnimatePresence>

      <motion.div 
        className="goal-box__form"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
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
        <motion.button 
          onClick={handleAdd} 
          className="goal-box__add-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Add Goal
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default GoalBox;