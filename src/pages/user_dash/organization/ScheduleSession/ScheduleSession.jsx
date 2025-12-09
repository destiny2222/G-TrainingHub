import React, { useState } from 'react';
import { CloseCircle } from 'iconsax-reactjs';
import axios from 'axios';
import './ScheduleSession.css';
import api from '../../../../utils/api';
import { useFetchOrgUser } from '../../../../utils/orgUser';

const ScheduleSession = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const user = useFetchOrgUser();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      
      
      const response = await api.post('/organization/schedule-sessions/store',
        {
          ...formData,
          user_id: user?.id
        }
      );

      setSuccess('Session scheduled successfully!');
      setFormData({ title: '', description: '' });
      
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to schedule session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ title: '', description: '' });
    setError('');
    setSuccess('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="schedule-session-modal-overlay" onClick={handleClose}>
      <div className="schedule-session-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="schedule-session-modal-header">
          <h2>Schedule a Session</h2>
          <button className="schedule-session-close-btn" onClick={handleClose}>
            <CloseCircle size="24" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="schedule-session-form">
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="form-group">
            <label htmlFor="title">Session Title <span className="text-danger">*</span></label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter session title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description <span className="text-danger">*</span></label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              rows="5"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide details about the session"
              required
            ></textarea>
          </div>

          <div className="schedule-session-modal-footer">
            <button 
              type="button" 
              className="btn-cancel" 
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-submit"
              disabled={loading}
            >
              {loading ? 'Scheduling...' : 'Schedule Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleSession;
