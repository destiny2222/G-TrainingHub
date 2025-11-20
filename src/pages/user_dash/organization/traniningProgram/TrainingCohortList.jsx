import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrganizationCohorts, initializeCohortPayment } from '../../../../redux/slices/admin_organisation/trainingProgramSlice';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './TrainingProgram.css';

const TrainingCohortList = () => {
  const dispatch = useDispatch();
  const { organizationCohorts, loading, error, paymentLoading } = useSelector((state) => state.trainingProgram);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const handlePayment = async (cohortId) => {
    try {
      const resultAction = await dispatch(initializeCohortPayment(cohortId));
      if (initializeCohortPayment.fulfilled.match(resultAction)) {
        const { authorization_url } = resultAction.payload.data;
        if (authorization_url) {
          window.location.href = authorization_url;
        } else {
          toast.error("Payment initialization failed: No authorization URL received");
        }
      } else {
        toast.error(resultAction.payload || "Payment initialization failed");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    }
  };

  useEffect(() => {
    dispatch(getOrganizationCohorts());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }, [error]);

  const filteredCohorts = organizationCohorts.filter(cohort => {
    const matchesSearch = cohort.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cohort.course_title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || cohort.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusClass = (startDate, endDate, status) => {
    if (status === 'inactive') return 'inactive';
    
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return 'inactive';
    if (now > end) return 'completed';
    return 'active';
  };

  if (loading) {
    return (
      <div className="training-program-container">
        <div className="training-program-header">
          <h1>Training Cohorts</h1>
          <Skeleton width={150} height={40} />
        </div>
        
        <div className="training-program-filters">
          <Skeleton height={45} width={300} />
          <Skeleton height={45} width={150} />
        </div>
        
        <div className="training-program-stats">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="stat-card">
              <Skeleton width={100} height={20} />
              <Skeleton width={40} height={30} style={{ marginTop: '0.5rem' }} />
            </div>
          ))}
        </div>
        
        <div className="training-program-table-container">
          {[1, 2, 3].map(i => (
            <div key={i} className="cohort-card">
              <Skeleton height={150} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="training-program-container">
      <div className="training-program-header">
        <h1>Training Cohorts</h1>
      </div>

      <div className="training-program-filters">
        <div className="search-box">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search by cohort name or course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label>Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Cohorts</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="training-program-stats">
        <div className="stat-card">
          <h4>Total Cohorts</h4>
          <p className="stat-value">{organizationCohorts.length}</p>
        </div>
        <div className="stat-card">
          <h4>Active Cohorts</h4>
          <p className="stat-value">
            {organizationCohorts.filter(c => getStatusClass(c.start_date, c.end_date, c.status) === 'active').length}
          </p>
        </div>
        <div className="stat-card">
          <h4>Total Members</h4>
          <p className="stat-value">
            {organizationCohorts.reduce((sum, c) => sum + (c.enrolled_members_count || 0), 0)}
          </p>
        </div>
        <div className="stat-card">
          <h4>Completed</h4>
          <p className="stat-value">
            {organizationCohorts.reduce((sum, c) => sum + (c.completed_members_count || 0), 0)}
          </p>
        </div>
      </div>

      <div className="training-program-table-container">
        {filteredCohorts.length > 0 ? (
          filteredCohorts.map((cohort) => (
            <div key={cohort.id} className="cohort-card">
              <div className="cohort-header">
                <div className="cohort-title">
                  <h3>{cohort.name}</h3>
                  <div className="course-info">
                    {cohort.course_image && (
                      <img 
                        src={cohort.course_image} 
                        alt={cohort.course_title}
                        className="course-image"
                      />
                    )}
                    <div className="course-details">
                      <h4>{cohort.course_title}</h4>
                      <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: 0 }}>
                        {cohort.duration}
                      </p>
                    </div>
                  </div>
                </div>
                <span className={`status-badge ${getStatusClass(cohort.start_date, cohort.end_date, cohort.status)}`}>
                  {getStatusClass(cohort.start_date, cohort.end_date, cohort.status)}
                </span>
              </div>

              <div className="cohort-dates">
                <div>
                  <strong>Start:</strong> {new Date(cohort.start_date).toLocaleDateString()}
                </div>
                <div>
                  <strong>End:</strong> {new Date(cohort.end_date).toLocaleDateString()}
                </div>
                {cohort.price && (
                  <div>
                    <strong>Price:</strong> ₦{Number(cohort.price).toLocaleString()}
                  </div>
                )}
              </div>

              <div className="cohort-stats">
                <div className="cohort-stat">
                  <div className="cohort-stat-label">Enrolled</div>
                  <div className="cohort-stat-value">{cohort.enrolled_members_count || 0}</div>
                </div>
                <div className="cohort-stat">
                  <div className="cohort-stat-label">Active</div>
                  <div className="cohort-stat-value">{cohort.active_members_count || 0}</div>
                </div>
                <div className="cohort-stat">
                  <div className="cohort-stat-label">Completed</div>
                  <div className="cohort-stat-value">{cohort.completed_members_count || 0}</div>
                </div>
              </div>

              <div className="action-buttons" style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                <Link 
                  to={`/organization/trainings/cohorts/${cohort.id}/members`} 
                  className="btn-primary"
                >
                  View Members
                </Link>
                {cohort.payment_status !== 'paid' && cohort.price > 0 && (
                  <button 
                    onClick={() => handlePayment(cohort.id)}
                    className="btn-secondary"
                    disabled={paymentLoading}
                  >
                    {paymentLoading ? 'Processing...' : 'Pay Now'}
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-data">
            <div className="no-data-content">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M32 42.6667V32M32 21.3333H32.0267M56 32C56 45.2548 45.2548 56 32 56C18.7452 56 8 45.2548 8 32C8 18.7452 18.7452 8 32 8C45.2548 8 56 18.7452 56 32Z" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h3>No cohorts found</h3>
              <p>You don't have any members enrolled in cohorts yet</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingCohortList;
