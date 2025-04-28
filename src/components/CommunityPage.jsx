import React from 'react';
import FriendsSidebar from './FriendsSidebar';
import CommunityFeed from './CommunityFeed';
import './CommunityPage.css';

const CommunityPage = () => {
  return (
    <div className="community-page-layout">
      <FriendsSidebar />
      <CommunityFeed />
    </div>
  );
};

export default CommunityPage; 