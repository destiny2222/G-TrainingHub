import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCohorts, deleteCohort } from '../../../redux/slices/cohortSlice';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import '../course/Course.css';

const CohortList = () => {
  const dispatch = useDispatch();
  const { cohorts, loading, error } = useSelector((state) => state.cohorts);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    dispatch(fetchCohorts());
  }, [dispatch]);

  const handleDelete = async (slug) => {
    if (window.confirm('Are you sure you want to delete this cohort?')) {
      try {
        await dispatch(deleteCohort(slug)).unwrap();
        toast.success('Cohort deleted successfully!', {
          position: "top-right",
          autoClose: 3000,
        });
      } catch (error) {
        toast.error('Failed to delete cohort: ' + (error.message || error), {
          position: "top-right",
          autoClose: 5000,
        });
      }
    }
  };

  const filteredCohorts = cohorts.filter(cohort => {
    const matchesSearch = cohort.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cohort.course?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || cohort.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusClass = (startDate, endDate, status) => {
    if (status === 'inactive') return 'inactive';
    
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) return 'upcoming';
    if (now > end) return 'completed';
    return 'active';
  };

  const getStatusText = (startDate, endDate, status) => {
    if (status === 'inactive') return 'Inactive';
    
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) return 'Upcoming';
    if (now > end) return 'Completed';
    return 'Active';
  };

  if (loading) {
    return (
      <div className="course-list-container">
        <div className="course-list-header">
          <h1>Cohort Management</h1>
          <Skeleton width={150} height={40} />
        </div>
        
        <div className="course-filters">
          <Skeleton height={45} width={300} />
          <Skeleton height={45} width={150} />
        </div>
        
        <div className="course-stats">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="stat-card">
              <Skeleton width={120} height={20} />
              <Skeleton width={40} height={30} style={{ marginTop: '0.5rem' }} />
            </div>
          ))}
        </div>
        
        <div className="course-table-container">
          <table className="course-table">
            <thead>
              <tr>
                <th>Cohort Name</th>
                <th>Course</th>
                <th>Price</th>
                <th>Duration</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map(i => (
                <tr key={i}>
                  <td><Skeleton width={180} /></td>
                  <td><Skeleton width={200} /></td>
                  <td><Skeleton width={60} /></td>
                  <td><Skeleton width={80} /></td>
                  <td><Skeleton width={90} /></td>
                  <td><Skeleton width={90} /></td>
                  <td><Skeleton width={80} /></td>
                  <td><Skeleton width={100} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="course-list-container">
        <div style={{ textAlign: 'center', padding: '3rem', color: '#dc2626' }}>
          <p>Error loading cohorts: {error.message || error}</p>
          <button onClick={() => dispatch(fetchCohorts())} className="btn-primary" style={{ marginTop: '1rem' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="course-list-container">
      <div className="course-list-header">
        <h1>Cohort Management</h1>
        <Link to="/admin/cohorts/create" className="btn-primary">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Add New Cohort
        </Link>
      </div>

      <div className="course-filters">
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
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="course-stats">
        <div className="stat-card">
          <h4>Total Cohorts</h4>
          <p className="stat-value">{cohorts.length}</p>
        </div>
        <div className="stat-card">
          <h4>Active Cohorts</h4>
          <p className="stat-value">
            {cohorts.filter(c => getStatusClass(c.start_date, c.end_date, c.status) === 'active').length}
          </p>
        </div>
        <div className="stat-card">
          <h4>Upcoming Cohorts</h4>
          <p className="stat-value">
            {cohorts.filter(c => getStatusClass(c.start_date, c.end_date, c.status) === 'upcoming').length}
          </p>
        </div>
        <div className="stat-card">
          <h4>Completed Cohorts</h4>
          <p className="stat-value">
            {cohorts.filter(c => getStatusClass(c.start_date, c.end_date, c.status) === 'completed').length}
          </p>
        </div>
      </div>

      <div className="course-table-container">
        <table className="course-table">
          <thead>
            <tr>
              <th>Cohort Name</th>
              <th>Course</th>
              <th>Price</th>
              <th>Duration</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCohorts.length > 0 ? (
              filteredCohorts.map((cohort) => (
                <tr key={cohort.id}>
                  <td>
                    <div className="course-title">
                      <h4>{cohort.name}</h4>
                    </div>
                  </td>
                  <td>
                    <span className="category-badge">{cohort.course.title}</span>
                  </td>
                  <td className="price">{cohort.price}</td>
                  <td>{cohort.duration}</td>
                  <td>{new Date(cohort.start_date).toLocaleDateString()}</td>
                  <td>{new Date(cohort.end_date).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(cohort.start_date, cohort.end_date, cohort.status)}`}>
                      {getStatusText(cohort.start_date, cohort.end_date, cohort.status)}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/admin/cohorts/${cohort.slug || cohort.id}`} className="btn-action btn-view" title="View Details">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 8C1 8 3.5 3 8 3C12.5 3 15 8 15 8C15 8 12.5 13 8 13C3.5 13 1 8 1 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </Link>
                      <Link to={`/admin/cohorts/edit/${cohort.slug || cohort.id}`} className="btn-action btn-edit" title="Edit">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11.333 2.00004C11.5081 1.82494 11.716 1.68605 11.9447 1.59129C12.1735 1.49653 12.4187 1.44775 12.6663 1.44775C12.914 1.44775 13.1592 1.49653 13.3879 1.59129C13.6167 1.68605 13.8246 1.82494 13.9997 2.00004C14.1748 2.17513 14.3137 2.383 14.4084 2.61178C14.5032 2.84055 14.552 3.08575 14.552 3.33337C14.552 3.58099 14.5032 3.82619 14.4084 4.05497C14.3137 4.28374 14.1748 4.49161 13.9997 4.66671L5.33301 13.3334L1.33301 14.6667L2.66634 10.6667L11.333 2.00004Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </Link>
                      <button 
                        onClick={() => handleDelete(cohort.slug || cohort.id)} 
                        className="btn-action btn-delete"
                        title="Delete"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2 4H3.33333H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M5.33301 4.00004V2.66671C5.33301 2.31309 5.47348 1.97395 5.72353 1.7239C5.97358 1.47385 6.31272 1.33337 6.66634 1.33337H9.33301C9.68663 1.33337 10.0258 1.47385 10.2758 1.7239C10.5259 1.97395 10.6663 2.31309 10.6663 2.66671V4.00004M12.6663 4.00004V13.3334C12.6663 13.687 12.5259 14.0261 12.2758 14.2762C12.0258 14.5262 11.6866 14.6667 11.333 14.6667H4.66634C4.31272 14.6667 3.97358 14.5262 3.72353 14.2762C3.47348 14.0261 3.33301 13.687 3.33301 13.3334V4.00004H12.6663Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">
                  <div className="no-data-content">
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M32 42.6667V32M32 21.3333H32.0267M56 32C56 45.2548 45.2548 56 32 56C18.7452 56 8 45.2548 8 32C8 18.7452 18.7452 8 32 8C45.2548 8 56 18.7452 56 32Z" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <h3>No cohorts found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CohortList;
