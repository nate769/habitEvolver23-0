import React from 'react';
import FriendsSidebar from './FriendsSidebar';
import CommunityFeed from './CommunityFeed';
import LeaderboardSidebar from './LeaderboardSidebar';
import './CommunityPage.css';

const CommunityPage = () => {
  return (
    <div className="community-page-layout">
      <FriendsSidebar />
      <CommunityFeed />
      <LeaderboardSidebar />
    </div>
  );
};

export default CommunityPage; 