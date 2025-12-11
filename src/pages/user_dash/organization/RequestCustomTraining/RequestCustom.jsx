import React, { useState } from 'react';
import { CloseCircle } from 'iconsax-reactjs';
import '../../../../assets/css/RequestCustom.css';
import api from '../../../../utils/api';
import { useFetchOrgUser } from '../../../../utils/orgUser';

const RequestCustom = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    training_name: '',
    description: '',
    participants_count: '',
    preferred_date: '',
    duration: '',
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
      const response = await api.post('/organization/custom-training/request', {
        ...formData,
        user_id: user?.id
      });

      setSuccess('Training request submitted successfully!');
      setFormData({
        training_name: '',
        description: '',
        participants_count: '',
        preferred_date: '',
        duration: '',
      });
      
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      training_name: '',
      description: '',
      participants_count: '',
      preferred_date: '',
      duration: '',
    });
    setError('');
    setSuccess('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="request-custom-modal-overlay" onClick={handleClose}>
      <div className="request-custom-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="request-custom-modal-header">
          <h2>Request Custom Training</h2>
          <button className="request-custom-close-btn" onClick={handleClose}>
            <CloseCircle size="24" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="request-custom-form">
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="form-group">
            <label htmlFor="training_name">Training Name <span className="text-danger">*</span></label>
            <input
              type="text"
              id="training_name"
              name="training_name"
              className="form-control"
              value={formData.training_name}
              onChange={handleChange}
              placeholder="Enter training name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description <span className="text-danger">*</span></label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your training requirements"
              required
            ></textarea>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="participants_count">Number of Participants <span className="text-danger">*</span></label>
                <input
                  type="number"
                  id="participants_count"
                  name="participants_count"
                  className="form-control"
                  value={formData.participants_count}
                  onChange={handleChange}
                  placeholder="e.g., 20"
                  min="1"
                  required
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="duration">Duration (days) <span className="text-danger">*</span></label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  className="form-control"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g., 5"
                  min="1"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="preferred_date">Preferred Start Date <span className="text-danger">*</span></label>
            <input
              type="date"
              id="preferred_date"
              name="preferred_date"
              className="form-control"
              value={formData.preferred_date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="request-custom-modal-footer">
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
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestCustom;