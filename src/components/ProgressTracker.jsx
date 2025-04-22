
import { useState, useEffect } from 'react';
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
      <h3>Progress</h3>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
      <p>{Math.round(progress)}% Complete</p>
    </div>
  );
}

export default ProgressTracker;