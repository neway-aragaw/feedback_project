import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StarRating from './StarRating';
import './FeedbackForm.css';

const FeedbackForm = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    category: '',
    rating: 0,
    message: '',
  });

  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRatingChange = (rating) => {
    setForm({ ...form, rating });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus('');

    try {
      const response = await fetch('http://localhost:5000/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        setStatus('✅ Done! Your feedback was submitted.');
        setForm({ name: '', email: '', category: '', rating: 0, message: '' });
        setDone(true);
      } else {
        setStatus('❌ Failed to submit. Please try again.');
        setDone(false);
      }
    } catch (error) {
      setStatus('❌ Error submitting feedback.');
      console.error(error);
      setDone(false);
    }

    setSubmitting(false);
    setTimeout(() => setStatus(''), 4000);
  };

  return (
    <div className="form-wrapper">
      <h2>We value your thoughts</h2>
      <form onSubmit={handleSubmit} className="feedback-form">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          <option value="Bug">🐞 Bug</option>
          <option value="Suggestion">💡 Suggestion</option>
          <option value="Compliment">🎉 Compliment</option>
        </select>

        <StarRating rating={form.rating} onRatingChange={handleRatingChange} />

        <textarea
          name="message"
          placeholder="Your Feedback"
          value={form.message}
          onChange={handleChange}
          maxLength={300}
          required
        />

        <div className="char-count">{form.message.length}/300</div>

        <button type="submit" disabled={submitting}>
          {done ? '✅ Done' : submitting ? 'Submitting...' : 'Submit Feedback'}
        </button>

        <button
          type="button"
          className="view-feedback-button"
          onClick={() => navigate('/view')}
        >
          View Feedback
        </button>

        {status && <div className="status-message">{status}</div>}
      </form>
    </div>
  );
};

export default FeedbackForm;
