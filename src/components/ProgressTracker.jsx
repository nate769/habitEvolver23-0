import { useState, useEffect } from 'react';
import './ProgressTracker.css';

function ProgressTracker({ goals }) {
  const [progress, setProgress] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const completedGoals = goals.filter(goal => goal.completed).length;
    const totalGoals = goals.length;
    setCompletedCount(completedGoals);
    setTotalCount(totalGoals);
    setProgress(totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0);
  }, [goals]);

  return (
    <div className="progress-tracker">
      <h3>Daily Progress</h3>
      <div className="progress-stats">
        <div className="progress-stat">
          <span className="stat-label">Completed</span>
          <span className="stat-value">{completedCount}</span>
        </div>
        <div className="progress-stat">
          <span className="stat-label">Total</span>
          <span className="stat-value">{totalCount}</span>
        </div>
      </div>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="progress-percentage">{Math.round(progress)}% Complete</p>
    </div>
  );
}

export default ProgressTracker;