import React from 'react';
import './VideoPlayer.css';

const VideoPlayer = ({ videoUrl, title }) => {
  return (
    <div className="video-player">
      <h3 className="video-title">{title}</h3>
      <div className="video-container">
        {/* In a real app, you would use a video player library or embed code */}
        <div className="video-placeholder">
          <div className="play-icon">▶</div>
          <p className="video-url">{videoUrl}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;