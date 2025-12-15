import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getOrganizationCohorts, getCohortMembers } from '../../../../redux/slices/admin_organisation/trainingProgramSlice';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './TrainingProgram.css';

const TrainingProgramList = () => {
  const dispatch = useDispatch();
  const [enrolledMembers, setEnrolledMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEnrolledMembers = async () => {
      try {
        setLoading(true);
        // 1. Fetch all cohorts
        const cohortsAction = await dispatch(getOrganizationCohorts());
        
        // Handle the response structure - could be payload.data or just payload
        let cohorts = [];
        if (cohortsAction.payload) {
          cohorts = Array.isArray(cohortsAction.payload) 
            ? cohortsAction.payload 
            : (cohortsAction.payload.data || []);
        }

        if (cohorts.length === 0) {
          setEnrolledMembers([]);
          setLoading(false);
          return;
        }

        // 2. Fetch members for each cohort
        // Handle both old and new data structures (subscription.cohort.id vs cohort.id)
        const membersPromises = cohorts.map(subscription => {
          const cohortId = subscription.cohort?.id || subscription.id;
          return dispatch(getCohortMembers(cohortId))
            .then(action => action.payload)
            .catch(error => {
              return { data: [] };
            });
        });
        
        const membersResponses = await Promise.all(membersPromises);
        
        // 3. Aggregate and deduplicate members based on user information
        const allMembers = [];
        const memberIds = new Set();

        membersResponses.forEach(response => {
          const enrollments = Array.isArray(response) ? response : (response?.data || []);
          enrollments.forEach(enrollment => {
            // Extract user data from the enrollment
            const user = enrollment.user;
            if (user && user.id) {
              const memberId = user.id;
              if (!memberIds.has(memberId)) {
                memberIds.add(memberId);
                allMembers.push({
                  id: memberId,
                  name: user.name,
                  email: user.email,
                  profile_picture: user.profile_picture,
                  status: enrollment.status || 'active'
                });
              }
            }
          });
        });

        setEnrolledMembers(allMembers);
      } catch (error) {
        toast.error("Failed to load enrolled members");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledMembers();
  }, [dispatch]);

  const filteredMembers = enrolledMembers.filter(member => {
    return member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           member.email?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="training-program-container">
        <div className="training-program-header">
          <h1>Training Programs</h1>
          <Skeleton width={150} height={40} />
        </div>
        
        <div className="training-program-filters">
          <Skeleton height={45} width={300} />
        </div>
        
        <div className="training-program-stats">
          {[1, 2].map(i => (
            <div key={i} className="stat-card">
              <Skeleton width={100} height={20} />
              <Skeleton width={40} height={30} style={{ marginTop: '0.5rem' }} />
            </div>
          ))}
        </div>
        
        <div className="training-program-table-container">
          <table className="training-program-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map(i => (
                <tr key={i}>
                  <td><Skeleton width={200} /></td>
                  <td><Skeleton width={250} /></td>
                  <td><Skeleton width={150} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="training-program-container">
      <div className="training-program-header">
        <h1>Enrolled Members</h1>
        <div className="d-flex flex-wrap gap-2">
          <Link to="/organization/trainings/courses" className="btn-primary mb-2 mb-lg-0">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Register Cohort
          </Link>
          <Link to="/organization/trainings/cohorts" className="btn-secondary mb-2 mb-lg-0">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 8L10 3L17 8M4 9V16C4 16.5304 4.21071 17.0391 4.58579 17.4142C4.96086 17.7893 5.46957 18 6 18H14C14.5304 18 15.0391 17.7893 15.4142 17.4142C15.7893 17.0391 16 16.5304 16 16V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            View Enroll Cohorts
          </Link>
          <Link to='/organization/trainings/assign' className='btn-secondary mb-2 mb-lg-0'>
            Assign Members
          </Link>
        </div>
      </div>

      <div className="training-program-filters">
        <div className="search-box">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search members by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="training-program-stats">
        <div className="stat-card">
          <h4>Total Enrolled</h4>
          <p className="stat-value">{enrolledMembers.length}</p>
        </div>
        <div className="stat-card">
          <h4>Active Members</h4>
          <p className="stat-value">{enrolledMembers.filter(m => m.status === 'active').length}</p>
        </div>
      </div>

      <div className="training-program-table-container">
        <table className="training-program-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <tr key={member.id}>
                  <td>
                    <div className="member-info">
                      {member.profile_picture ? (
                        <img 
                          src={member.profile_picture} 
                          alt={member.name}
                          className="member-avatar"
                        />
                      ) : (
                        <div className="member-avatar" style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          background: '#3b82f6',
                          color: 'white',
                          fontWeight: 'bold'
                        }}>
                          {member.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="member-details">
                        <h4>{member.name}</h4>
                      </div>
                    </div>
                  </td>
                  <td>{member.email}</td>
                  <td>
                    <span className={`status-badge ${member.status || 'active'}`}>
                      {member.status || 'active'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link 
                        to={`/organization/trainings/member/${member.id}`} 
                        className="btn-action btn-view" 
                        title="View Training Programs"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 8C1 8 3.5 3 8 3C12.5 3 15 8 15 8C15 8 12.5 13 8 13C3.5 13 1 8 1 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </Link>
                      <Link 
                        to={`/organization/trainings/assign/${member.id}`} 
                        className="btn-action btn-assign" 
                        title="Assign Course"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-data">
                  <div className="no-data-content">
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M32 42.6667V32M32 21.3333H32.0267M56 32C56 45.2548 45.2548 56 32 56C18.7452 56 8 45.2548 8 32C8 18.7452 18.7452 8 32 8C45.2548 8 56 18.7452 56 32Z" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <h3>No members found</h3>
                    <p>Try adjusting your search criteria</p>
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

export default TrainingProgramList;
