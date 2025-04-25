import React, { useState, useEffect } from 'react';
import './GoalBox.css';
import AlarmFeature from './AlarmFeature';
import Confetti from './Confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FaBook, FaDumbbell, FaBrain, FaHeart, FaLaptopCode, FaMedal, FaClock, FaEdit, FaSearch, FaCalendarAlt } from 'react-icons/fa';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import useSound from 'use-sound';

// Use CDN URL instead of local file
const successSoundUrl = 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_12b0c19592.mp3';

const API_URL = 'https://jsonplaceholder.typicode.com/todos';

// const categoryIcons = {
//   study: FaBook,
//   workout: FaDumbbell,
//   health: FaHeart,
//   coding: FaLaptopCode,
//   mindfulness: FaBrain,
//   achievement: FaMedal,
//   other: FaClock
// };

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

function AddGoalForm({ onAddGoal }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('other');
  const [priority, setPriority] = useState('Medium');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddGoal({
      id: Date.now(),
      title: title.trim(),
      category,
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
      streak: 0
    });

    setTitle('');
    setCategory('other');
    setPriority('Medium');
  };

  return (
    <form className="add-goal-form" onSubmit={handleSubmit}>
      <h3>Add New Goal</h3>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="title">Goal Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your goal..."
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="study">Study</option>
            <option value="workout">Workout</option>
            <option value="health">Health</option>
            <option value="coding">Coding</option>
            <option value="mindfulness">Mindfulness</option>
            <option value="achievement">Achievement</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      <button type="submit" className="add-goal-button">
        Add Goal
      </button>
    </form>
  );
}

function GoalHeatmap({ completionHistory }) {
  const today = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 90); // Show last 90 days

  const values = completionHistory.map(date => ({
    date: new Date(date).toISOString().split('T')[0],
    count: 1
  }));

  return (
    <div className="goal-heatmap">
      <CalendarHeatmap
        startDate={startDate}
        endDate={today}
        values={values}
        classForValue={(value) => {
          if (!value) return 'color-empty';
          return `color-scale-${Math.min(value.count, 4)}`;
        }}
        tooltipDataAttrs={value => {
          if (!value || !value.date) return null;
          return {
            'data-tip': `${value.date}: ${value.count} completion${value.count !== 1 ? 's' : ''}`
          };
        }}
      />
    </div>
  );
}

function SearchAndFilter({ onSearch, onFilterChange, selectedTags, selectedPriority }) {
  return (
    <div className="search-filter">
      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search goals..."
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <div className="filter-tags">
        <button 
          className={`filter-tag ${selectedPriority === 'all' ? 'active' : ''}`}
          onClick={() => onFilterChange('priority', 'all')}
        >
          All
        </button>
        <button 
          className={`filter-tag priority-high ${selectedPriority === 'high' ? 'active' : ''}`}
          onClick={() => onFilterChange('priority', 'high')}
        >
          High Priority
        </button>
        <button 
          className={`filter-tag priority-medium ${selectedPriority === 'medium' ? 'active' : ''}`}
          onClick={() => onFilterChange('priority', 'medium')}
        >
          Medium Priority
        </button>
        <button 
          className={`filter-tag priority-low ${selectedPriority === 'low' ? 'active' : ''}`}
          onClick={() => onFilterChange('priority', 'low')}
        >
          Low Priority
        </button>
      </div>
    </div>
  );
}

function MotivationalQuote({ isVisible }) {
  const quotes = [
    { text: "Small steps every day lead to big changes.", author: "Unknown" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Don't count the days, make the days count.", author: "Muhammad Ali" },
    { text: "The future depends on what you do today.", author: "Mahatma Gandhi" }
  ];

  const [quote, setQuote] = useState(quotes[0]);

  useEffect(() => {
    if (isVisible) {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setQuote(randomQuote);
    }
  }, [isVisible]);

  return (
    <motion.div 
      className="motivational-quote"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.5 }}
    >
      <p className="quote-text">{quote.text}</p>
      <p className="quote-author">- {quote.author}</p>
    </motion.div>
  );
}

function GoalBox({ setDailyPoints, goals, setGoals }) {
  const [newGoal, setNewGoal] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confettiPosition, setConfettiPosition] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [playSuccess] = useSound(successSoundUrl);
  const [showQuote, setShowQuote] = useState(false);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch goals');
      const data = await response.json();
      
      // Transform API data to match our goal structure
      const transformedGoals = data.slice(0, 5).map(item => ({
        text: item.title,
        date: '',
        time: '',
        completed: item.completed,
        taskStreak: 0,
        position: 'right',
        priority: 'medium',
        completionHistory: [],
        longestStreak: 0
      }));
      
      setGoals(transformedGoals);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      // Fallback to localStorage if API fails
      const savedGoals = localStorage.getItem('goals');
      if (savedGoals) {
        const parsedGoals = JSON.parse(savedGoals);
        const goalsWithPriority = parsedGoals.map(goal => ({
          ...goal,
          priority: goal.priority || 'medium'
        }));
        setGoals(goalsWithPriority);
      }
    }
  };

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
      
      // Play success sound
      playSuccess();
      
      // Show motivational quote
      setShowQuote(true);
      setTimeout(() => setShowQuote(false), 3000);
      
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
        className="goal-box__chart"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <WeeklyProgress data={getWeeklyCompletionData()} />
      </motion.div>

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

      <MotivationalQuote isVisible={showQuote} />

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
                  <div className="goal-content">
                    <motion.span 
                      className="goal-title"
                      onDoubleClick={() => handleEdit(index)}
                      whileHover={{ scale: 1.02 }}
                    >
                      {goal.text}
                    </motion.span>
                    <motion.button
                      className="edit-button"
                      onClick={() => handleEdit(index)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaEdit />
                    </motion.button>
                    <div className="goal-tags">
                      {goal.tags?.map((tag, i) => (
                        <span key={i} className="goal-tag">#{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <GoalHeatmap completionHistory={goal.completionHistory || []} />
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
        <AddGoalForm onAddGoal={(newGoal) => {
          setGoals([...goals, newGoal]);
        }} />
      </motion.div>
    </motion.div>
  );
}

export default GoalBox;