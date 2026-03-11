# Business Requirements Document (BRD)

## Project Name: RMCOHST Application Web App
**Client/Organization**: Remington College of Health Science and Technology (RMCOHST)

---

## 1. Executive Summary
The RMCOHST Application Web App is a comprehensive digital platform designed to digitize and manage the entire student admissions lifecycle. It serves as a unified digital ecosystem where prospective students can browse programs, apply for admissions, upload credentials, and pay fees. At the same time, it empowers college staff (Admissions Officers, Head of Admissions, and ICT Administrators) with a centralized suite of tools to process applications, review qualifications, track payments, and manage institutional data.

## 2. Business Objectives
- **Digitize the Admissions Process**: Transition from a paper-based or disjointed system to a fully automated, online application workflow.
- **Improve Accuracy and Efficiency**: Enable real-time processing and status tracking of applications, reducing manual workload and processing errors.
- **Enhance Applicant Experience**: Provide prospective students with a transparent, user-friendly portal to track their admission status, complete prerequisites, and process payments securely.
- **Centralize Administrative Control**: Equip the ICT and Admissions teams with dashboards to manage programs, evaluate candidate qualifications, and finalize admissions decisions efficiently.

## 3. Scope of the System
The system covers three main functional areas, segmented by user roles:
1. **Applicant Portal**: Program discovery, application submission (Biodata, SSC/O'Level, Program-Specific Qualifications), payment processing (Application Fee, Acceptance Fee), and status tracking.
2. **Admissions Portal**: Application assignment, review, acceptance/rejection, and task management for admissions staff.
3. **ICT / Admin Portal**: Configuration of academic sessions, faculties, departments, accepted subjects/grades, system programs, and baseline qualification requirements.

## 4. Stakeholders
- **Prospective Students (Applicants)**: Primary users applying for admission into the college.
- **Admissions Officers**: Staff members responsible for the initial review and vetting of applications.
- **Head of Admissions**: Lead staff responsible for assigning applications, performing final reviews, and making admission decisions.
- **ICT Administrator / Super Admin**: System administrators responsible for configuring the academic calendar, program offerings, and system-wide settings.
- **Finance Department** (Indirect): Beneficiaries of the integrated payment gateway (e.g., Paystack) for fee collection.

## 5. High-Level Business Requirements
1. **Role-Based Access Control (RBAC)**: The system must enforce strong authentication (Login, Signup, Email Verification, Password Recovery) and route users to role-specific dashboards.
2. **Fee Collection & Tracking**: The platform must integrate with robust payment gateways to collect Application Fees and Acceptance Fees, issuing automated digital receipts.
3. **Qualification Verification**: Applications must natively capture and validate O'Level/SSC qualifications (max sittings, subjects, and grades) against dynamically configured criteria.
4. **Application Workflow management**: The system must support a standardized application state machine (DRAFT -> SUBMITTED -> UNDER_REVIEW -> APPROVED/REJECTED -> ADMITTED).
5. **Session & Program Management**: Administrators must be able to publish new academic sessions and map them dynamically to departments and faculties.
