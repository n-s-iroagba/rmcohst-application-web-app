# Product Requirements Document (PRD)

## Project Name: RMCOHST Application Web App
**Client**: Remington College of Health Science and Technology (RMCOHST)

---

## 1. Product Overview
The RMCOHST Application Web App is an end-to-end digital admissions portal built specifically for the college's varying academic programs (Undergraduate, Postgraduate, Certificate Studies). It provides an intuitive, state-of-the-art UI for students to process their applications and make secure fee payments, while equipping college staff with the tools necessary to review qualifications and manage the academic cycle.

## 2. Target Audience & Roles
- **Applicant**: Users seeking admission. They must discover programs, submit their biodata/qualifications, and track payment/application states.
- **Admissions Officer**: Staff handling the frontline review of student credentials and issuing preliminary assessments.
- **Head of Admissions**: Lead decision-maker who assigns applications to officers and makes the final determination on admissions and rejections.
- **ICT Admin / Super Admin**: System managers who configure academic sessions, departments, accepted grading scales, and program offerings.

## 3. Product Features & Functional Requirements

### 3.1 Authentication & Authorization
- **User Personas**: Distinct sign-up flows for applicants. Staff accounts are provisioned separately.
- **Security Features**: Email Verification flows via 6-digit OTP codes, "Forgot Password" functionality via email link, and secure login.
- **Role-Based Routing**: After login, users are automatically routed to their respective dashboards (`/applicant/dashboard`, `/admissions/tasks`, `/ict-admin/dashboard`).

### 3.2 Applicant Experience Workflows
- **Program Discovery**: Applicants can filter dynamic program listings by "Level" and search by "Name" to find their desired course.
- **Payment Processing (Phase 1)**: Initiating the Application Fee payment via Paystack securely. Handling pending/failed scenarios gracefully.
- **Application Submission**: An interactive multi-step form:
  1. *Biodata*: Personal information, Next of Kin, and demographics.
  2. *SSC Qualifications*: Logging WAEC/NECO grades, managing maximum sittings limits, and ensuring mandatory core subjects.
  3. *Program Requirements*: Subject-specific or secondary qualifications needed for certain courses.
  4. *Review*: Final overview preventing submission of incomplete sections.
- **Dashboard Tracking**: A persistent tracker evaluating the application state machine (`DRAFT`, `SUBMITTED`, `UNDER_REVIEW`, `APPROVED`, `ADMITTED`, `REJECTED`).
- **Payment Processing (Phase 2)**: Admitted students receive prompts to "Pay Acceptance Fee" to secure their spot.

### 3.3 Admissions Officer Workflows
- **Pending Tasks**: View a list of assigned applications requiring review.
- **Application Drilldown**: Access a deep-dive view into an applicant's submitted SSC certificates and Biodata.
- **Decisions**: Log evaluation comments and recommend approvals or rejections to the Head of Admissions.

### 3.4 Head of Admissions Workflows
- **Application Assignment**: Distribute unassigned applications to specific Admission Officers to balance workloads.
- **Final Admission Roster**: View all "Applications in Review" and publish the final list of "Admitted" and "Rejected" applications.

### 3.5 ICT Administrator Workflows
- **Session Management**: Initiate new Admission Sessions and toggle active cycles.
- **Academic Hierarchy**: Build out Faculties, Departments, and map specific Programs to them.
- **Criteria Configuration**: Declare accepted SSC Qualifications (WAEC, NECO) and dynamically govern the accepted grades/sittings policy.

## 4. User Experience & Design Mechanics
- The product uses a deeply integrated notification system to alert users of missing tasks directly on the dashboard (e.g., "Your acceptance fee payment is pending").
- Color-coded badges and icons (using Lucide React) dynamically correspond to application status states.
