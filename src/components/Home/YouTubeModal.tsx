import React from 'react';
import './HeaderContent.scss';
interface YouTubeModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
}

const YouTubeModal: React.FC<YouTubeModalProps> = ({ isOpen, onClose, videoId }) => {
  if (!isOpen) return null;

  const videoSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&cc_load_policy=1&enablejsapi=1`;

  return (
    <div className="modal-overlay">
      <span className="close" onClick={onClose}>&times;</span>
      <div className="modal-content">
        <iframe
          src={videoSrc}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube video player"
          style={{ width: '50%', height: '100%' }}
        ></iframe>
      </div>
    </div>
  );
}

export default YouTubeModal;
