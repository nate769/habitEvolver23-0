import React, { useEffect, useState } from 'react';
import './LeaderboardSidebar.css';

const getLeaderboardData = () => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  // Calculate completed goals and streaks for each user
  return users.map(user => {
    const completed = (user.goals || []).filter(g => g.completed).length;
    // Calculate streak (consecutive days with all goals completed)
    let streak = 0;
    if (user.completedDates && user.completedDates.length) {
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      while (true) {
        if (!user.completedDates.includes(currentDate.toDateString())) break;
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      }
    }
    return {
      username: user.username,
      completed,
      streak,
    };
  });
};

const LeaderboardSidebar = () => {
  const [leaders, setLeaders] = useState([]);
  const [streakLeaders, setStreakLeaders] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const data = getLeaderboardData();
    setLeaders([...data].sort((a, b) => b.completed - a.completed).slice(0, 10));
    setStreakLeaders([...data].sort((a, b) => b.streak - a.streak).slice(0, 10));
    setCurrentUser(JSON.parse(localStorage.getItem('currentUser') || 'null'));
  }, []);

  return (
    <aside className="leaderboard-sidebar">
      <h3>🏆 Leaderboard</h3>
      <div className="leaderboard-section">
        <h4>Most Habits Completed</h4>
        <ol className="leaderboard-list">
          {leaders.map((user, idx) => (
            <li key={user.username} className={currentUser?.username === user.username ? 'me' : ''}>
              <span className="leader-avatar">{user.username[0]?.toUpperCase()}</span>
              <span className="leader-name">{user.username}</span>
              <span className="leader-score">{user.completed}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="leaderboard-section">
        <h4>Longest Streak</h4>
        <ol className="leaderboard-list">
          {streakLeaders.map((user, idx) => (
            <li key={user.username} className={currentUser?.username === user.username ? 'me' : ''}>
              <span className="leader-avatar">{user.username[0]?.toUpperCase()}</span>
              <span className="leader-name">{user.username}</span>
              <span className="leader-score">{user.streak}</span>
            </li>
          ))}
        </ol>
      </div>
    </aside>
  );
};

export default LeaderboardSidebar; 