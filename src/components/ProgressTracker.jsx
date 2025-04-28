import { useState, useEffect } from 'react';
import './ProgressTracker.css';
import { motion, useSpring } from 'framer-motion';

function ProgressTracker({ goals }) {
  const [progress, setProgress] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const springProgress = useSpring(0, {
    stiffness: 60,
    damping: 15
  });

  useEffect(() => {
    const calculateProgress = () => {
      setIsLoading(true);
      try {
        const completed = goals.filter(goal => goal.completed).length;
        const total = goals.length;
        setCompletedCount(completed);
        setTotalCount(total);
        const newProgress = total > 0 ? (completed / total) * 100 : 0;
        setProgress(newProgress);
        springProgress.set(newProgress);
      } catch (error) {
        console.error('Error calculating progress:', error);
      } finally {
        setIsLoading(false);
      }
    };

    calculateProgress();
  }, [goals, springProgress]);

  return (
    <motion.div 
      className="progress-tracker"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h3
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Daily Progress
      </motion.h3>

      <motion.div 
        className="progress-stats"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div 
          className="progress-stat"
          whileHover={{ scale: 1.05 }}
        >
          <span className="stat-label">Completed</span>
          <motion.span 
            className="stat-value"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 500,
              damping: 30,
              delay: 0.4 
            }}
          >
            {isLoading ? '...' : completedCount}
          </motion.span>
        </motion.div>
        
        <motion.div 
          className="progress-stat"
          whileHover={{ scale: 1.05 }}
        >
          <span className="stat-label">Total</span>
          <motion.span 
            className="stat-value"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 500,
              damping: 30,
              delay: 0.5 
            }}
          >
            {isLoading ? '...' : totalCount}
          </motion.span>
        </motion.div>
      </motion.div>

      <div className="progress-bar">
        <motion.div 
          className="progress-fill" 
          style={{ width: springProgress }}
          initial={{ width: 0 }}
          animate={{ width: isLoading ? 0 : `${progress}%` }}
          transition={{ 
            type: "spring",
            stiffness: 60,
            damping: 15 
          }}
        />
      </div>

      <motion.p 
        className="progress-percentage"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {Math.round(progress)}% Complete
      </motion.p>
    </motion.div>
  );
}

export default ProgressTracker;