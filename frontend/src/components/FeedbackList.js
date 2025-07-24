import React from 'react';
import StarRating from './StarRating';
import './FeedbackList.css';

const FeedbackList = ({ feedbacks }) => {
  if (!feedbacks || feedbacks.length === 0) {
    return <p className="empty-list">No feedback yet.</p>;
  }

  return (
    <div className="feedback-list">
      <h3>Feedback Received</h3>
      {feedbacks.map((fb, index) => (
        <div key={index} className="feedback-item">
          <div className="feedback-header">
            <strong>{fb.name}</strong> <span>({fb.category})</span>
          </div>
          <StarRating rating={fb.rating} readOnly />
          <p className="feedback-msg">{fb.message}</p>
        </div>
      ))}
    </div>
  );
};

export default FeedbackList;
