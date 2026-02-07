# Product Requirements Document (PRD)
# KaizenNote - Weekly Task Management App

**Version:** 1.0  
**Last Updated:** February 7, 2026  
**Time Zone:** Ho Chi Minh City, Vietnam (UTC+7)  
**Author:** Product Team

---

## 1. Project Overview

### 1.1 Product Name
**KaizenNote** - A weekly time-blocking and task management application focused on continuous improvement (Kaizen philosophy).

### 1.2 Product Vision
KaizenNote enables users to plan, track, and reflect on their weekly activities through a visual hourly grid system. By combining time-blocking with activity categorization and reflection, users can continuously improve their productivity and work-life balance. When time change, it will automatically update the weekly grid.

### 1.3 Target Audience
- Professionals seeking better time management
- Students managing study schedules
- Individuals practicing continuous self-improvement
- Anyone who wants to track daily activities and improve productivity

---

## 2. Goals and Objectives

### 2.1 Primary Goals
1. Provide a visual weekly planning interface with hourly granularity
2. Enable activity and project tracking for better insights
3. Support reflection through Plan-Result-Improvement methodology
4. Deliver actionable insights through reporting and analytics
5. Ensure data privacy with multi-user authentication

### 2.2 Success Metrics
- User engagement: Average time spent planning per week
- Completion rate: Percentage of planned tasks completed
- User retention: Weekly active users
- Feature adoption: Usage of reflection and reporting features

---

## 3. User Stories

### 3.1 Authentication
- **As a user**, I want to create an account with username and password so that I can securely access my data
- **As a user**, I want to log in to my account so that I can view my tasks
- **As a user**, I want my data to be private so that other users cannot see my information

### 3.2 Weekly Planning
- **As a user**, I want to see a weekly grid with 7 days and 24 hours per day so that I can plan my entire week
- **As a user**, I want to assign tasks to specific time blocks so that I can organize my day
- **As a user**, I want to categorize activities by type so that I can understand how I spend my time
- **As a user**, I want to optionally assign projects to tasks so that I can track project-related work

### 3.3 Activity & Project Management
- **As a user**, I want to create, edit, and delete activity types so that I can customize categories to my needs
- **As a user**, I want to create, edit, and delete projects so that I can organize my work effectively
- **As a user**, I want predefined activity types (Sleep, Exercise, Learn Code, Reading, Working) as starting defaults

### 3.4 Reflection
- **As a user**, I want to add "Plan" notes for each day so that I can outline my intentions
- **As a user**, I want to add "Result" notes for each day so that I can record what actually happened
- **As a user**, I want to add "Improvement" notes for each day so that I can identify areas for growth

### 3.5 Reporting
- **As a user**, I want to view statistics and charts about my activities so that I can gain insights
- **As a user**, I want to see time distribution by activity type
- **As a user**, I want to see time distribution by project
- **As a user**, I want to track trends over multiple weeks

---

## 4. Functional Requirements

### 4.1 Authentication & Authorization

#### 4.1.1 User Registration
- Users can create an account with:
  - Username (unique, required)
  - Password (minimum 8 characters, required)
- Basic validation and error handling

#### 4.1.2 User Login
- Users log in with username and password
- Session management with JWT or similar
- Logout functionality

#### 4.1.3 Data Isolation
- Each user can only access their own data
- API endpoints must validate user ownership
- Database queries must filter by authenticated user

### 4.2 Weekly Grid Interface

#### 4.2.1 Visual Layout
- **Grid Structure:**
  - 7 columns representing Monday through Sunday
  - 24 rows per column representing hours (00:00 - 23:00)
  - Each cell represents a 1-hour time block
  
- **Day Block Components:**
  - 24-hour grid (24 small boxes)
  - "Plan" text box for daily planning notes
  - "Result" text box for daily outcome notes
  - "Improvement" text box for daily reflection notes

#### 4.2.2 Time Block Interaction
- Click on a time block to assign/edit:
  - Task note (text description)
  - Activity type (dropdown selection)
  - Project (optional dropdown selection)
- Visual distinction for blocks with assigned tasks (color coding by activity type)
- Ability to copy/move tasks between time blocks
- Multi-hour task spanning (optional enhancement)

#### 4.2.3 Daily Reflection Boxes
- "Plan" box: Enter daily goals and intentions
- "Result" box: Record actual outcomes and accomplishments
- "Improvement" box: Note what could be improved for next time
- All boxes support rich text or markdown (optional)

### 4.3 Activity Type Management

#### 4.3.1 Default Activity Types
- Sleep
- Exercise
- Learn Code
- Reading
- Working

#### 4.3.2 CRUD Operations
- **Create:** Add new activity type with name and color
- **Read:** View all activity types
- **Update:** Edit activity type name and color
- **Delete:** Remove activity type (with warning if tasks exist)

#### 4.3.3 Visual Representation
- Each activity type has an associated color for visual identification
- Color picker for customization

### 4.4 Project Management

#### 4.4.1 CRUD Operations
- **Create:** Add new project with name, description, and color
- **Read:** View all user projects
- **Update:** Edit project details
- **Delete:** Remove project (with warning if tasks exist)

#### 4.4.2 Project Association
- Projects are optional for tasks
- Multiple tasks can belong to one project
- Visual grouping by project in reporting

### 4.5 Reporting & Analytics Dashboard

#### 4.5.1 Required Charts/Statistics
1. **Time Distribution by Activity Type**
   - Pie chart showing percentage of time per activity
   - Bar chart showing hours per activity type
   - Filterable by date range (week, month, custom)

2. **Time Distribution by Project**
   - Pie chart showing percentage of time per project
   - Bar chart showing hours per project
   - Filterable by date range

3. **Weekly Overview**
   - Line chart showing activity hours per day
   - Heatmap of activity intensity by hour and day

4. **Trends Analysis**
   - Week-over-week comparison
   - Monthly trends

5. **Summary Statistics**
   - Total hours tracked
   - Most common activity type
   - Most active day/hour
   - Project progress summary

#### 4.5.2 Data Export
- Export data as CSV or JSON (optional)
- Print-friendly view of weekly grid

---

## 5. Technical Requirements

### 5.1 Technology Stack

#### 5.1.1 Frontend
- **Framework:** Next.js (React)
- **UI Components:** React components with modern design
- **Styling:** CSS Modules / Tailwind CSS / Styled Components
- **State Management:** React Context API or Zustand
- **Charts:** Chart.js / Recharts / D3.js

#### 5.1.2 Backend
- **Framework:** Next.js API Routes, Shadcn UI, Lucide Icons
- **Database:** MongoDB Atlas
- **Authentication:** NextAuth.js or custom JWT implementation
- **Validation:** Zod or Yup for schema validation

#### 5.1.3 Development Environment
- **Local Server:** localhost:8084
- **Node.js version:** 18+ recommended
- **Package Manager:** npm or yarn

### 5.2 Database Schema

#### 5.2.1 Users Collection
```javascript
{
  _id: ObjectId,
  username: String (unique, required),
  password: String (hashed, required),
  createdAt: Date,
  updatedAt: Date
}
```

#### 5.2.2 ActivityTypes Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (reference to Users),
  name: String (required),
  color: String (hex color code),
  createdAt: Date,
  updatedAt: Date
}
```

#### 5.2.3 Projects Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (reference to Users),
  name: String (required),
  description: String,
  color: String (hex color code),
  createdAt: Date,
  updatedAt: Date
}
```

#### 5.2.4 Tasks Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (reference to Users),
  date: Date,
  hour: Number (0-23),
  note: String,
  activityTypeId: ObjectId (reference to ActivityTypes),
  projectId: ObjectId (reference to Projects, optional),
  createdAt: Date,
  updatedAt: Date
}
```

#### 5.2.5 DailyReflections Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (reference to Users),
  date: Date,
  plan: String,
  result: String,
  improvement: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 5.3 API Endpoints

#### 5.3.1 Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

#### 5.3.2 Activity Types
- `GET /api/activity-types` - List all activity types for user
- `POST /api/activity-types` - Create new activity type
- `PUT /api/activity-types/:id` - Update activity type
- `DELETE /api/activity-types/:id` - Delete activity type

#### 5.3.3 Projects
- `GET /api/projects` - List all projects for user
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

#### 5.3.4 Tasks
- `GET /api/tasks?startDate=&endDate=` - Get tasks for date range
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

#### 5.3.5 Daily Reflections
- `GET /api/reflections/:date` - Get reflection for specific date
- `POST /api/reflections` - Create/update daily reflection
- `DELETE /api/reflections/:id` - Delete reflection

#### 5.3.6 Reports
- `GET /api/reports/activity-distribution?startDate=&endDate=` - Activity stats
- `GET /api/reports/project-distribution?startDate=&endDate=` - Project stats
- `GET /api/reports/weekly-overview?weekStart=` - Weekly overview
- `GET /api/reports/trends?weeks=` - Trend analysis

---

## 6. UI/UX Specifications

### 6.1 Page Structure

#### 6.1.1 Main Navigation
- **Weekly Grid** (default view)
- **Dashboard/Reports** tab
- **Settings** (Activity Types, Projects management)
- **Profile** (User settings, logout)

#### 6.1.2 Weekly Grid View
- Header showing week range (e.g., "Feb 3 - Feb 9, 2026")
- Week navigation (Previous/Next week buttons)
- Today indicator
- 7-day grid with time blocks (00:00 - 23:00)
- Daily reflection boxes beneath each day column

#### 6.1.3 Dashboard View
- Date range selector
- Multiple chart components
- Summary statistics cards
- Filterable views

### 6.2 Responsive Design
- Desktop-first design (primary use case)
- Tablet support with horizontal scrolling
- Mobile view with condensed layout (one day at a time)

### 6.3 Color Scheme & Theming
- Light/Dark mode toggle (optional)
- Activity types color-coded
- Projects color-coded
- Professional, clean design aesthetic

### 6.4 Interaction Patterns
- Click to edit time blocks
- Inline editing for reflections
- Drag and drop for task rescheduling (optional enhancement)
- Keyboard shortcuts for power users (optional)

---

## 7. Security & Privacy Requirements

### 7.1 Authentication Security
- Passwords hashed using bcrypt or similar
- JWT tokens with appropriate expiration
- HTTPS in production environment
- CSRF protection for API routes

### 7.2 Data Privacy
- User data completely isolated
- No cross-user data sharing
- Server-side validation of user ownership
- Secure session management

### 7.3 Input Validation
- Client-side and server-side validation
- Sanitization of user inputs
- Protection against XSS and SQL injection

---

## 8. Performance Requirements

### 8.1 Loading Times
- Initial page load: < 2 seconds
- Task creation/update: < 500ms
- Chart rendering: < 1 second

### 8.2 Data Limits
- Support for at least 1 year of historical data per user
- Efficient queries with MongoDB indexing

---

## 9. Development Phases

### Phase 1: MVP (Minimum Viable Product)
- [ ] User authentication (register, login, logout)
- [ ] Weekly grid interface with 7 days × 24 hours
- [ ] Basic task creation with note and activity type
- [ ] Default activity types
- [ ] Daily reflection boxes (Plan, Result, Improvement)
- [ ] Basic settings page for activity type management

### Phase 2: Project Management & Enhanced Features
- [ ] Project CRUD operations
- [ ] Associate tasks with projects
- [ ] Enhanced task editing (inline, modal)
- [ ] Week navigation and date selection
- [ ] Visual enhancements and color coding

### Phase 3: Reporting & Analytics
- [ ] Dashboard tab with charts
- [ ] Activity type distribution charts
- [ ] Project distribution charts
- [ ] Weekly overview and trends
- [ ] Date range filtering

### Phase 4: Polish & Enhancements
- [ ] Drag and drop task rescheduling
- [ ] Multi-hour task spanning
- [ ] Data export functionality
- [ ] Dark mode
- [ ] Keyboard shortcuts
- [ ] Mobile responsive improvements

---

## 10. Future Enhancements (Post-MVP)

### 10.1 Potential Features
- Recurring tasks
- Task templates
- Goal setting and tracking
- Team collaboration features
- Calendar integration (Google Calendar, Outlook)
- Mobile native apps (iOS, Android)
- Email notifications and reminders
- AI-powered insights and recommendations
- Pomodoro timer integration
- Habit tracking

### 10.2 Scalability Considerations
- Implement caching (Redis) for frequently accessed data
- CDN for static assets
- Database replication for high availability
- Microservices architecture for larger scale

---

## 11. Success Criteria

### 11.1 Launch Criteria
- All Phase 1 (MVP) features fully functional
- Authentication and data security validated
- Responsive design working on desktop and tablet
- Basic analytics dashboard operational
- User testing completed with positive feedback

### 11.2 Post-Launch Metrics
- User retention rate > 60% after 1 month
- Average weekly planning time > 15 minutes
- Task completion rate > 70%
- Dashboard feature adoption > 40%
- User satisfaction score > 4/5

---

## 12. Technical Configuration

### 12.1 Local Development Setup
```bash
# Server Configuration
PORT=8084
NODE_ENV=development

# MongoDB Atlas
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/kaizennote?retryWrites=true&w=majority

# Authentication
JWT_SECRET=<your-secret-key>
JWT_EXPIRES_IN=7d

# Time Zone
TZ=Asia/Ho_Chi_Minh
```

### 12.2 Environment Variables
- `PORT`: Application port (8084)
- `MONGODB_URI`: MongoDB Atlas connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `NEXT_PUBLIC_APP_URL`: Application base URL
- `TZ`: Time zone setting (Asia/Ho_Chi_Minh)

---

## 13. Glossary

- **Kaizen:** Japanese philosophy of continuous improvement
- **Time Block:** 1-hour segment in the weekly grid
- **Activity Type:** Category of task (e.g., Sleep, Exercise)
- **Project:** Optional grouping for related tasks
- **Daily Reflection:** Plan, Result, Improvement notes for each day
- **Dashboard:** Analytics and reporting interface

---

## 14. Appendix

### 14.1 Design Mockup Notes
- Weekly grid should be the primary, most prominent interface
- Each hour block should be clearly clickable with hover states
- Color coding should be subtle but distinguishable
- Reflection boxes should be expandable/collapsible for space management

### 14.2 Technical References
- Next.js Documentation: https://nextjs.org/docs
- MongoDB Atlas: https://www.mongodb.com/atlas
- Chart.js: https://www.chartjs.org/
- NextAuth.js: https://next-auth.js.org/

---

**Document Status:** Draft  
**Next Review Date:** February 14, 2026  
**Approval Required From:** Product Owner, Technical Lead

---

*This PRD serves as the single source of truth for the KaizenNote project. All stakeholders should refer to this document for feature specifications and technical requirements.*
