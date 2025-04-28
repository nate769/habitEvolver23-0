import React, { useState, useEffect } from 'react';
import './FriendsSidebar.css';

const getInitialUsers = () => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  return users.map(u => u.username);
};

const FriendsSidebar = () => {
  const [friends, setFriends] = useState(() => {
    const saved = localStorage.getItem('friendsList');
    return saved ? JSON.parse(saved) : [];
  });
  const [search, setSearch] = useState('');
  const [allUsers, setAllUsers] = useState(getInitialUsers());

  useEffect(() => {
    localStorage.setItem('friendsList', JSON.stringify(friends));
  }, [friends]);

  const handleAddFriend = (username) => {
    if (!friends.includes(username)) {
      setFriends([...friends, username]);
    }
  };

  const handleRemoveFriend = (username) => {
    setFriends(friends.filter(f => f !== username));
  };

  const filteredUsers = allUsers.filter(
    u => u.toLowerCase().includes(search.toLowerCase()) && !friends.includes(u)
  );

  return (
    <aside className="friends-sidebar">
      <h3>Friends</h3>
      <div className="friends-list">
        {friends.length === 0 ? (
          <div className="no-friends">No friends yet.</div>
        ) : (
          friends.map(friend => (
            <div key={friend} className="friend-item">
              <span className="friend-avatar">{friend[0]?.toUpperCase()}</span>
              <span className="friend-name">{friend}</span>
              <button className="remove-friend-btn" onClick={() => handleRemoveFriend(friend)} title="Remove friend">×</button>
            </div>
          ))
        )}
      </div>
      <div className="add-friend-section">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="search-results">
          {filteredUsers.slice(0, 5).map(user => (
            <div key={user} className="search-user-item">
              <span>{user}</span>
              <button className="add-friend-btn" onClick={() => handleAddFriend(user)} title="Add friend">+</button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default FriendsSidebar; 