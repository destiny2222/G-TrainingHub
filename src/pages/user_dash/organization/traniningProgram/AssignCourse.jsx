import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { assignCourseToMember, clearState, getOrganizationCohorts } from '../../../../redux/slices/admin_organisation/trainingProgramSlice';
import { getOrganizationMember, getOrganizationMembers } from '../../../../redux/slices/organisationUserSlice';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './TrainingProgram.css';

const AssignCourse = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { loading, error, success, message, organizationCohorts } = useSelector((state) => state.trainingProgram);
  const { member, members, loading: memberLoading } = useSelector((state) => state.organizationUser);

  const [formData, setFormData] = useState({
    organization_user_id: memberId || '',
    cohort_id: ''
  });

  const [availableCohorts, setAvailableCohorts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(getOrganizationCohorts());
    if (memberId) {
      dispatch(getOrganizationMember(memberId));
    } else {
      dispatch(getOrganizationMembers());
    }
  }, [dispatch, memberId]);

  // Process organization cohorts to extract cohort data
  useEffect(() => {
    if (organizationCohorts && organizationCohorts.length > 0) {
      const cohorts = organizationCohorts
        .filter(subscription => subscription.status === 'paid' && subscription.cohort)
        .map(subscription => ({
          id: subscription.cohort.id,
          name: subscription.cohort.name,
          start_date: subscription.cohort.start_date,
          end_date: subscription.cohort.end_date,
          status: subscription.cohort.status,
          course: subscription.cohort.course,
          subscription_id: subscription.id
        }));
      setAvailableCohorts(cohorts);
    }
  }, [organizationCohorts]);

  useEffect(() => {
    if (memberId) {
      setFormData(prev => ({ ...prev, organization_user_id: memberId }));
    }
  }, [memberId]);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-right",
        autoClose: 5000,
      });
    }
    if (success) {
      toast.success(message, {
        position: "top-right",
        autoClose: 3000,
      });
      dispatch(clearState());
      const targetMemberId = memberId || formData.organization_user_id;
      if (targetMemberId) {
        navigate(`/organization/trainings/member/${targetMemberId}`);
      } else {
        navigate('/organization/training-programs');
      }
    }
  }, [error, success, message, dispatch, navigate, memberId, formData.organization_user_id]);

  const handleMemberChange = (e) => {
    setFormData(prev => ({ ...prev, organization_user_id: e.target.value }));
  };

  const handleCohortChange = (e) => {
    setFormData(prev => ({ ...prev, cohort_id: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.cohort_id) {
      toast.error('Please select a cohort', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const selectedCohort = availableCohorts.find(c => c.id === formData.cohort_id);
    
    const submitData = {
      // orguser_id: formData.organization_user_id,
      cohort_id: formData.cohort_id,
      course_id: selectedCohort?.course?.id,
      user_id: memberId || formData.organization_user_id,
    };

    try {
      setIsSubmitting(true);
      await dispatch(assignCourseToMember(submitData)).unwrap();
    } catch (err) {
      // Error is handled in useEffect
      setIsSubmitting(false);
    }
  };

  const isLoading = (memberLoading || loading) && !isSubmitting;

  if (isLoading && (!member && memberId)) {
    return (
      <div className="training-program-container">
        <div className="training-program-header">
          <div>
            <Skeleton height={20} width={150} style={{ marginBottom: '1rem' }} />
            <Skeleton height={40} width={300} />
            <Skeleton height={20} width={200} style={{ marginTop: '0.5rem' }} />
          </div>
        </div>
        <div className="training-program-table-container" style={{ maxWidth: '600px', padding: '2rem' }}>
          <div className="form-group">
            <Skeleton height={20} width={120} style={{ marginBottom: '0.5rem' }} />
            <Skeleton height={45} />
          </div>
          <div className="form-group" style={{ marginTop: '1.5rem' }}>
            <Skeleton height={20} width={120} style={{ marginBottom: '0.5rem' }} />
            <Skeleton height={45} />
          </div>
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
            <Skeleton height={45} width={120} />
            <Skeleton height={45} width={180} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="training-program-container">
      <div className="training-program-header">
        <div>
          {memberId ? (
            <Link to={`/organization/trainings/member/${memberId}`} style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '0.9rem' }}>
              ← Back to Member Training
            </Link>
          ) : (
            <Link to="/organization/training-programs" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '0.9rem' }}>
              ← Back to Training Programs
            </Link>
          )}
          <h1>Assign Cohort {member ? `to ${member?.name}` : ''}</h1>
          {member && (
            <p style={{ color: '#6b7280', margin: '0.5rem 0 0 0' }}>
              {member.email}
            </p>
          )}
        </div>
      </div>

      <div className="training-program-table-container">
        <form onSubmit={handleSubmit}>
          {!memberId && (
            <div className="form-group">
              <label htmlFor="member">Select Member *</label>
              {isLoading ? (
                <Skeleton height={45} />
              ) : (
                <select
                  id="member"
                  value={formData.organization_user_id}
                  onChange={handleMemberChange}
                  disabled={isSubmitting}
                  required
                >
                  <option value="">-- Select a Member --</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.email})
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="cohort">Select Cohort *</label>
            {isLoading ? (
              <>
                <Skeleton height={45} />
                <Skeleton height={15} width={250} style={{ marginTop: '0.5rem' }} />
              </>
            ) : (
              <>
                <select
                  id="cohort"
                  value={formData.cohort_id}
                  onChange={handleCohortChange}
                  disabled={isSubmitting || availableCohorts.length === 0}
                  required
                >
                  <option value="">-- Select a Cohort --</option>
                  {availableCohorts
                    .filter(cohort => cohort.status === 'active')
                    .map((cohort) => (
                      <option key={cohort.id} value={cohort.id}>
                        {cohort.name} - {cohort.course?.title || 'N/A'} ({new Date(cohort.start_date).toLocaleDateString()} - {new Date(cohort.end_date).toLocaleDateString()})
                      </option>
                    ))}
                </select>
                {availableCohorts.length === 0 && (
                  <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.5rem' }}>
                    No paid cohorts available. Please register for a cohort first.
                  </p>
                )}
              </>
            )}
          </div>

          <div className="modal-actions" style={{ marginTop: '2rem' }}>
            {isLoading ? (
              <>
                <Skeleton height={45} width={120} />
                <Skeleton height={45} width={200} />
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => navigate(`/organization/trainings/member/${memberId}`)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Assigning...' : 'Assign Member to Cohort'}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignCourse;
