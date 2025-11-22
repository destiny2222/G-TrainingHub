# Training Program Navigation Integration Guide

This guide shows you how to add links to the Training Program module from various parts of your application.

---

## 🔗 Adding Navigation Links

### 1. From Organization Sidebar

Add to your `MemberOrgSidebar.jsx` or organization navigation component:

```jsx
import { Link } from 'react-router-dom';

// In your navigation menu
<nav>
  <Link to="/organization/dashboard">Dashboard</Link>
  <Link to="/organization/members">Members</Link>
  
  {/* Add Training Program Links */}
  <Link to="/organization/trainings">Training Programs</Link>
  <Link to="/organization/trainings/cohorts">Cohorts</Link>
</nav>
```

### 2. From Organization Dashboard

Add quick access cards to `OrganizationDashboard.jsx`:

```jsx
<div className="dashboard-cards">
  {/* Existing cards */}
  
  {/* Training Program Card */}
  <Link to="/organization/trainings" className="dashboard-card">
    <div className="card-icon">🎓</div>
    <h3>Training Programs</h3>
    <p>Manage member courses and track progress</p>
  </Link>
  
  <Link to="/organization/trainings/cohorts" className="dashboard-card">
    <div className="card-icon">👥</div>
    <h3>Cohorts</h3>
    <p>View cohort enrollments and statistics</p>
  </Link>
</div>
```

### 3. From Member List

Add action buttons to `MemberList.jsx`:

```jsx
// In your member table row
<td>
  <div className="action-buttons">
    <Link to={`/organization/members/${member.id}`}>View</Link>
    <Link to={`/organization/members/${member.id}/edit`}>Edit</Link>
    
    {/* Add Training Link */}
    <Link to={`/organization/trainings/member/${member.id}`}>
      Training
    </Link>
  </div>
</td>
```

### 4. From Member Profile/Show

Add to `MemberShow.jsx`:

```jsx
// In member details page
<div className="member-actions">
  <Link to={`/organization/members/${member.id}/edit`}>Edit Profile</Link>
  
  {/* Add Training Link */}
  <Link to={`/organization/trainings/member/${member.id}`} className="btn-primary">
    <svg>...</svg>
    View Training Programs
  </Link>
  
  <Link to={`/organization/trainings/assign/${member.id}`} className="btn-secondary">
    <svg>...</svg>
    Assign Course
  </Link>
</div>
```

---

## 🎨 Navigation Component Example

Create a dedicated Training submenu component:

```jsx
// src/components/member_organization_component/TrainingMenu.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const TrainingMenu = () => {
  const location = useLocation();
  
  const menuItems = [
    {
      path: '/organization/trainings',
      label: 'Members Training',
      icon: '👨‍🎓'
    },
    {
      path: '/organization/trainings/cohorts',
      label: 'Cohorts',
      icon: '👥'
    }
  ];
  
  return (
    <div className="training-menu">
      <h4>Training Management</h4>
      {menuItems.map(item => (
        <Link
          key={item.path}
          to={item.path}
          className={location.pathname === item.path ? 'active' : ''}
        >
          <span className="icon">{item.icon}</span>
          <span className="label">{item.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default TrainingMenu;
```

---

## 📱 Mobile Navigation

For mobile hamburger menu:

```jsx
// In your mobile menu
<div className="mobile-menu">
  <Link to="/organization/dashboard">Dashboard</Link>
  <Link to="/organization/members">Members</Link>
  
  {/* Training Section */}
  <div className="menu-section">
    <h4>Training</h4>
    <Link to="/organization/trainings">Programs</Link>
    <Link to="/organization/trainings/cohorts">Cohorts</Link>
  </div>
</div>
```

---

## 🎯 Breadcrumb Integration

Add to your breadcrumb component:

```jsx
const breadcrumbMap = {
  '/organization/trainings': 'Training Programs',
  '/organization/trainings/cohorts': 'Cohorts',
  '/organization/trainings/member/:id': 'Member Training',
  '/organization/trainings/assign/:id': 'Assign Course',
  // ... other routes
};
```

---

## 🔔 Notification Integration

Example notification that links to training:

```jsx
// When a member completes a course
const notification = {
  title: 'Course Completed!',
  message: 'John Doe completed "React Basics"',
  link: '/organization/trainings/member/123',
  linkText: 'View Progress'
};
```

---

## 📊 Dashboard Widgets

Add training statistics widget to dashboard:

```jsx
// In OrganizationDashboard.jsx
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getOrganizationCohorts } from '../redux/slices/admin_organisation/trainingProgramSlice';

const OrganizationDashboard = () => {
  const dispatch = useDispatch();
  const { organizationCohorts } = useSelector(state => state.trainingProgram);
  
  useEffect(() => {
    dispatch(getOrganizationCohorts());
  }, [dispatch]);
  
  return (
    <div className="dashboard">
      {/* Training Statistics Widget */}
      <div className="widget training-stats">
        <h3>Training Overview</h3>
        <div className="stats">
          <div>
            <label>Active Cohorts</label>
            <span>{organizationCohorts.filter(c => c.status === 'active').length}</span>
          </div>
          <div>
            <label>Total Enrolled</label>
            <span>
              {organizationCohorts.reduce((sum, c) => sum + c.enrolled_members_count, 0)}
            </span>
          </div>
        </div>
        <Link to="/organization/trainings/cohorts" className="view-all">
          View All Cohorts →
        </Link>
      </div>
    </div>
  );
};
```

---

## 🎨 Icon Suggestions

Use these icons for navigation (you can use any icon library):

- **Training Programs**: 🎓 📚 📖 ✏️
- **Cohorts**: 👥 👨‍👩‍👧‍👦 🏫 🎯
- **Progress**: 📊 📈 ⏳ ✅
- **Assign**: ➕ ✚ 📝 🔗

SVG example for training icon:
```jsx
<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M10 3L3 7L10 11L17 7L10 3Z" stroke="currentColor" strokeWidth="2"/>
  <path d="M3 13L10 17L17 13" stroke="currentColor" strokeWidth="2"/>
</svg>
```

---

## 🎨 Styling Navigation Links

CSS for active navigation state:

```css
/* In your navigation CSS */
.nav-link {
  padding: 0.75rem 1rem;
  color: #6b7280;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s;
}

.nav-link:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.nav-link.active {
  background: #dbeafe;
  color: #1e40af;
  font-weight: 600;
}

.nav-link .icon {
  width: 20px;
  height: 20px;
}
```

---

## 🔍 Search Integration

Add training results to global search:

```jsx
// In your search component
const searchResults = {
  members: [...],
  courses: [...],
  // Add training results
  trainings: [
    {
      type: 'cohort',
      name: 'AI Bootcamp January',
      link: '/organization/trainings/cohorts/123/members'
    },
    {
      type: 'member-training',
      name: 'John Doe - React Course',
      link: '/organization/trainings/member/456'
    }
  ]
};
```

---

## 📋 Quick Actions Menu

Add to a quick actions dropdown:

```jsx
<div className="quick-actions-dropdown">
  <button>Quick Actions</button>
  <div className="dropdown-menu">
    <Link to="/organization/members/create">Add Member</Link>
    
    {/* Training Quick Actions */}
    <hr />
    <div className="section-label">Training</div>
    <Link to="/organization/trainings">View All Training</Link>
    <Link to="/organization/trainings/cohorts">View Cohorts</Link>
  </div>
</div>
```

---

## ✅ Integration Checklist

After adding navigation links:

- [ ] Test all links navigate correctly
- [ ] Verify protected routes work
- [ ] Check active state highlighting
- [ ] Test mobile navigation
- [ ] Verify breadcrumbs update
- [ ] Check back button functionality
- [ ] Test deep linking (direct URL access)
- [ ] Verify user permissions

---

## 🚀 Launch Checklist

Before going live:

1. **Navigation**
   - [ ] Add to main sidebar
   - [ ] Add to dashboard
   - [ ] Add to member list actions
   - [ ] Add to member profile

2. **Documentation**
   - [ ] Update user manual
   - [ ] Create training videos
   - [ ] Add tooltips/help text

3. **Testing**
   - [ ] Test all navigation paths
   - [ ] Test with different screen sizes
   - [ ] Test with different user roles
   - [ ] Verify analytics tracking

4. **Communication**
   - [ ] Announce new feature
   - [ ] Send training invitation
   - [ ] Prepare FAQ document

---

## 💡 Tips

1. **Highlight New Feature**: Add a "New" badge initially
   ```jsx
   <Link to="/organization/trainings">
     Training <span className="badge-new">New</span>
   </Link>
   ```

2. **Progressive Disclosure**: Show training link only if members exist
   ```jsx
   {members.length > 0 && (
     <Link to="/organization/trainings">Training Programs</Link>
   )}
   ```

3. **Contextual Links**: Show assign button only on member pages
   ```jsx
   {location.pathname.includes('/members/') && (
     <Link to={`/organization/trainings/assign/${memberId}`}>Assign</Link>
   )}
   ```

---

**Happy Integrating! 🎉**
