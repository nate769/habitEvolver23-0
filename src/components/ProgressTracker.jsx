import { useState, useEffect } from 'react';
import './ProgressTracker.css';

function ProgressTracker({ goals }) {
  const [progress, setProgress] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const calculateProgress = () => {
      const completed = goals.filter(goal => goal.completed).length;
      const total = goals.length;
      setCompletedCount(completed);
      setTotalCount(total);
      setProgress(total > 0 ? (completed / total) * 100 : 0);
    };

    calculateProgress();
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
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>
      <p className="progress-percentage">{Math.round(progress)}% Complete</p>
    </div>
  );
}

export default ProgressTracker;