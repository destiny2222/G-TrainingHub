import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { assignCourseToMember, clearState } from '../../../../redux/slices/admin_organisation/trainingProgramSlice';
import { fetchCourses } from '../../../../redux/slices/courseSlice';
import { fetchCohorts } from '../../../../redux/slices/cohortSlice';
import { getOrganizationMember, getOrganizationMembers } from '../../../../redux/slices/organisationUserSlice';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './TrainingProgram.css';

const AssignCourse = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { loading, error, success, message } = useSelector((state) => state.trainingProgram);
  const { courses } = useSelector((state) => state.courses);
  const { cohorts } = useSelector((state) => state.cohorts);
  const { member, members } = useSelector((state) => state.organizationUser);

  const [formData, setFormData] = useState({
    organization_user_id: memberId || '',
    course_id: '',
    cohort_id: ''
  });

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [availableCohorts, setAvailableCohorts] = useState([]);

  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchCohorts());
    if (memberId) {
      dispatch(getOrganizationMember(memberId));
    } else {
      dispatch(getOrganizationMembers());
    }
  }, [dispatch, memberId]);

  useEffect(() => {
    if (memberId) {
      setFormData(prev => ({ ...prev, organization_user_id: memberId }));
    }
  }, [memberId]);

  useEffect(() => {
    if (selectedCourse) {
      const courseCohorts = cohorts.filter(c => c.course_id === selectedCourse);
      setAvailableCohorts(courseCohorts);
    } else {
      setAvailableCohorts([]);
      setFormData(prev => ({ ...prev, cohort_id: '' }));
    }
  }, [selectedCourse, cohorts]);

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

  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    setFormData(prev => ({ ...prev, course_id: courseId, cohort_id: '' }));
    setSelectedCourse(courseId);
  };

  const handleCohortChange = (e) => {
    setFormData(prev => ({ ...prev, cohort_id: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.course_id) {
      toast.error('Please select a course', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const submitData = {
      organization_user_id: formData.organization_user_id,
      course_id: formData.course_id,
    };

    if (formData.cohort_id) {
      submitData.cohort_id = formData.cohort_id;
    }

    try {
      await dispatch(assignCourseToMember(submitData)).unwrap();
    } catch (err) {
      // Error is handled in useEffect
    }
  };

  if (!member && memberId) {
    return (
      <div className="training-program-container">
        <Skeleton height={40} width={300} />
        <div style={{ marginTop: '2rem' }}>
          <Skeleton height={400} />
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
          <h1>Assign Course {member ? `to ${member.name}` : ''}</h1>
          {member && (
            <p style={{ color: '#6b7280', margin: '0.5rem 0 0 0' }}>
              {member.email}
            </p>
          )}
        </div>
      </div>

      <div className="training-program-table-container" style={{ maxWidth: '600px', padding: '2rem' }}>
        <form onSubmit={handleSubmit}>
          {!memberId && (
            <div className="form-group">
              <label htmlFor="member">Select Member *</label>
              <select
                id="member"
                value={formData.organization_user_id}
                onChange={handleMemberChange}
                disabled={loading}
                required
              >
                <option value="">-- Select a Member --</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.email})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="course">Select Course *</label>
            <select
              id="course"
              value={formData.course_id}
              onChange={handleCourseChange}
              disabled={loading}
              required
            >
              <option value="">-- Select a Course --</option>
              {courses
                .filter(course => course.status === 'active')
                .map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="cohort">Select Cohort (Optional)</label>
            <select
              id="cohort"
              value={formData.cohort_id}
              onChange={handleCohortChange}
              disabled={loading || !selectedCourse || availableCohorts.length === 0}
            >
              <option value="">-- No Cohort --</option>
              {availableCohorts
                .filter(cohort => cohort.status === 'active')
                .map((cohort) => (
                  <option key={cohort.id} value={cohort.id}>
                    {cohort.name} ({new Date(cohort.start_date).toLocaleDateString()} - {new Date(cohort.end_date).toLocaleDateString()})
                  </option>
                ))}
            </select>
            {selectedCourse && availableCohorts.length === 0 && (
              <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.5rem' }}>
                No cohorts available for this course
              </p>
            )}
          </div>

          <div className="modal-actions" style={{ marginTop: '2rem' }}>
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate(`/organization/trainings/member/${memberId}`)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? 'Assigning...' : 'Assign Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignCourse;
