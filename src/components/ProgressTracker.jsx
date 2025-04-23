import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './ProgressTracker.css';

function ProgressTracker({ goals }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const completedGoals = goals.filter(goal => goal.completed).length;
    const totalGoals = goals.length;
    setProgress(totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0);
  }, [goals]);

  return (
    <div className="progress-tracker">
      <h3>Daily Progress</h3>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
      <p>{Math.round(progress)}% Complete</p>
    </div>
  );
}

ProgressTracker.propTypes = {
  goals: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired
  })).isRequired
};

export default ProgressTracker;