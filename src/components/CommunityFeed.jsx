import React, { useState, useEffect } from 'react';
import './CommunityFeed.css';

const getInitialPosts = () => {
  const saved = localStorage.getItem('communityPosts');
  return saved ? JSON.parse(saved) : [];
};

const CommunityFeed = () => {
  const [posts, setPosts] = useState(getInitialPosts);
  const [newPost, setNewPost] = useState('');
  const [commentInputs, setCommentInputs] = useState({});

  useEffect(() => {
    localStorage.setItem('communityPosts', JSON.stringify(posts));
  }, [posts]);

  const handlePost = (e) => {
    e.preventDefault();
    if (newPost.trim()) {
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      setPosts([
        {
          id: Date.now(),
          user: user.username || 'Anonymous',
          text: newPost,
          likes: 0,
          likedBy: [],
          comments: [],
          date: new Date().toISOString(),
        },
        ...posts,
      ]);
      setNewPost('');
    }
  };

  const handleLike = (id) => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    setPosts(posts.map(post => {
      if (post.id === id) {
        const hasLiked = post.likedBy.includes(user.username);
        return {
          ...post,
          likes: hasLiked ? post.likes - 1 : post.likes + 1,
          likedBy: hasLiked
            ? post.likedBy.filter(u => u !== user.username)
            : [...post.likedBy, user.username],
        };
      }
      return post;
    }));
  };

  const handleComment = (id) => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const comment = commentInputs[id]?.trim();
    if (comment) {
      setPosts(posts.map(post => {
        if (post.id === id) {
          return {
            ...post,
            comments: [
              ...post.comments,
              {
                id: Date.now(),
                user: user.username || 'Anonymous',
                text: comment,
                date: new Date().toISOString(),
              },
            ],
          };
        }
        return post;
      }));
      setCommentInputs(inputs => ({ ...inputs, [id]: '' }));
    }
  };

  return (
    <div className="community-feed-container">
      <h2>Community Motivation Wall</h2>
      <form onSubmit={handlePost} className="community-post-form">
        <textarea
          value={newPost}
          onChange={e => setNewPost(e.target.value)}
          placeholder="Share your progress, a win, or motivate others..."
          rows={3}
        />
        <button type="submit">Post</button>
      </form>
      <div className="community-posts-list">
        {posts.length === 0 ? (
          <div className="community-empty">No posts yet. Be the first to motivate the community!</div>
        ) : (
          posts.map(post => (
            <div key={post.id} className="community-post-card">
              <div className="community-post-header">
                <span className="community-post-user">{post.user}</span>
                <span className="community-post-date">{new Date(post.date).toLocaleString()}</span>
              </div>
              <p className="community-post-text">{post.text}</p>
              <div className="community-post-actions">
                <button
                  className={`like-btn${post.likedBy.includes(JSON.parse(localStorage.getItem('currentUser') || '{}').username) ? ' liked' : ''}`}
                  onClick={() => handleLike(post.id)}
                >
                  ❤️ {post.likes}
                </button>
              </div>
              <div className="community-comments-section">
                {post.comments.map(comment => (
                  <div key={comment.id} className="community-comment">
                    <span className="community-comment-user">{comment.user}:</span>
                    <span className="community-comment-text">{comment.text}</span>
                  </div>
                ))}
                <div className="community-comment-input">
                  <input
                    type="text"
                    value={commentInputs[post.id] || ''}
                    onChange={e => setCommentInputs(inputs => ({ ...inputs, [post.id]: e.target.value }))}
                    placeholder="Add a comment..."
                  />
                  <button onClick={() => handleComment(post.id)}>Comment</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommunityFeed; 