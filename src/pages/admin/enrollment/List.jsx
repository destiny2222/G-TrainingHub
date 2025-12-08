import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEnrollments, approveCertificate, unAssignCertificate } from '../../../redux/slices/super_admin/EnrollmentSilce';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import '../../admin/course/Course.css';

const EnrollmentList = () => {
  const dispatch = useDispatch();
  const { enrollments, loading, error } = useSelector((state) => state.enrollments);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [isApproving, setIsApproving] = useState(false);
  const [actionType, setActionType] = useState('approve'); // 'approve' or 'unapprove'

  useEffect(() => {
    dispatch(fetchEnrollments());
  }, [dispatch]);

  const openApprovalModal = (enrollment, action = 'approve') => {
    setSelectedEnrollment(enrollment);
    setActionType(action);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEnrollment(null);
    setActionType('approve');
  };

  const handleApproveCertificate = async () => {
    if (!selectedEnrollment) return;
    
    setIsApproving(true);
    try {
      if (actionType === 'approve') {
        await dispatch(approveCertificate(selectedEnrollment.id)).unwrap();
        toast.success('Certificate approved successfully!', {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        await dispatch(unAssignCertificate(selectedEnrollment.id)).unwrap();
        toast.success('Certificate unapproved successfully!', {
          position: "top-right",
          autoClose: 3000,
        });
      }
      closeModal();
      // Refresh the enrollments list to show updated data
      dispatch(fetchEnrollments());
    } catch (error) {
      const action = actionType === 'approve' ? 'approve' : 'unapprove';
      toast.error(`Failed to ${action} certificate: ` + (error.message || error), {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsApproving(false);
    }
  };

  const filteredEnrollments = enrollments.filter(enrollment => {
    const matchesSearch = 
      enrollment.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.cohort?.course?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.cohort?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
      (enrollment.approve_certificate?.toString() === filterStatus);
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="course-list-container">
        <div className="course-list-header">
          <h1>Enrollment Management</h1>
          <Skeleton width={150} height={40} />
        </div>
        
        <div className="course-filters">
          <Skeleton height={45} width={300} />
          <Skeleton height={45} width={150} />
        </div>
        
        <div className="course-stats">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="stat-card">
              <Skeleton width={100} height={20} />
              <Skeleton width={40} height={30} style={{ marginTop: '0.5rem' }} />
            </div>
          ))}
        </div>
        
        <div className="course-table-container">
          <table className="course-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Email</th>
                {/* <th>Course</th> */}
                <th>Cohort</th>
                <th>Certificate Status</th>
                <th>Enrolled Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map(i => (
                <tr key={i}>
                  <td><Skeleton width={150} /></td>
                  <td><Skeleton width={200} /></td>
                  {/* <td><Skeleton width={180} /></td> */}
                  <td><Skeleton width={120} /></td>
                  <td><Skeleton width={100} /></td>
                  <td><Skeleton width={90} /></td>
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
          <p>Error loading enrollments: {error.message || error}</p>
          <button onClick={() => dispatch(fetchEnrollments())} className="btn-primary" style={{ marginTop: '1rem' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const approvedCount = enrollments.filter(e => e.approve_certificate).length;
  const pendingCount = enrollments.filter(e => !e.approve_certificate).length;

  return (
    <div className="course-list-container">
      <div className="course-list-header">
        <h1>Enrollment Management</h1>
      </div>

      <div className="course-filters">
        <div className="search-box">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search by student, email, course, or cohort..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label>Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Enrollments</option>
            <option value="true">Certificate Approved</option>
            <option value="false">Pending Approval</option>
          </select>
        </div>
      </div>

      <div className="course-stats">
        <div className="stat-card">
          <h4>Total Enrollments</h4>
          <p className="stat-value">{enrollments.length}</p>
        </div>
        <div className="stat-card">
          <h4>Certificates Approved</h4>
          <p className="stat-value">{approvedCount}</p>
        </div>
        <div className="stat-card">
          <h4>Pending Approval</h4>
          <p className="stat-value">{pendingCount}</p>
        </div>
        <div className="stat-card">
          <h4>Unique Courses</h4>
          <p className="stat-value">{new Set(enrollments.map(e => e.course?.id)).size}</p>
        </div>
      </div>

      <div className="course-table-container">
        <table className="course-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Email</th>
              {/* <th>Course</th> */}
              <th>Cohort</th>
              <th>Certificate Status</th>
              <th>Enrolled Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEnrollments.length > 0 ? (
              filteredEnrollments.map((enrollment) => (
                <tr key={enrollment.id}>
                  <td>
                    <div className="course-title">
                      <h4>{enrollment.user?.name || 'N/A'}</h4>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      {enrollment.user?.email || 'N/A'}
                    </span>
                  </td>
                  {/* <td>
                    <div className="course-description">
                      <p>{enrollment.cohort?.course?.title || 'N/A'}</p>
                    </div>
                  </td> */}
                  <td>
                    <span className="category-badge">{enrollment.cohort?.name || 'N/A'}</span>
                  </td>
                  <td>
                    {enrollment.approve_certificate ? (
                      <span className="status-badge active">Approved</span>
                    ) : (
                      <span className="status-badge inactive">Pending</span>
                    )}
                  </td>
                  <td>{enrollment.enrolled_at ? new Date(enrollment.enrolled_at).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <div className="action-buttons">
                      {/* <Link to={`/admin/enrollments/${enrollment.id}`} className="btn-action btn-view" title="View Details">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 8C1 8 3.5 3 8 3C12.5 3 15 8 15 8C15 8 12.5 13 8 13C3.5 13 1 8 1 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </Link> */}
                      {!enrollment.approve_certificate ? (
                        <button 
                          onClick={() => openApprovalModal(enrollment, 'approve')} 
                          className="btn-action btn-edit"
                          title="Approve Certificate"
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.3337 4L6.00033 11.3333L2.66699 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      ) : (
                        <button 
                          onClick={() => openApprovalModal(enrollment, 'unapprove')} 
                          className="btn-action btn-delete"
                          title="Unapprove Certificate"
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
                  <div className="no-data-content">
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M32 42.6667V32M32 21.3333H32.0267M56 32C56 45.2548 45.2548 56 32 56C18.7452 56 8 45.2548 8 32C8 18.7452 18.7452 8 32 8C45.2548 8 56 18.7452 56 32Z" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <h3>No enrollments found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Approval Confirmation Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" style={{ width: "400px"}} onClick={(e) => e.stopPropagation()}>
            <div className="modal-body d-flex text-center align-items-center justify-content-center">
              <h3>Are you sure?</h3>
            </div>
            
            <div className="modal-footer d-flex justify-content-center ">
              <button 
                className="btn-modal-cancel" 
                onClick={closeModal}
                disabled={isApproving}
              >
                Cancel
              </button>
              <button 
                className={actionType === 'approve' ? 'btn-modal-confirm' : 'btn-modal-reject'}
                onClick={handleApproveCertificate}
                disabled={isApproving}
              >
                {isApproving ? (
                  <>
                    <span className="spinner"></span>
                    {actionType === 'approve' ? 'Approving...' : 'Unapproving...'}
                  </>
                ) : (
                  actionType === 'approve' ? 'Approve' : 'Unapprove'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrollmentList;