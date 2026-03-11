# Software Requirements Specification (SRS)

## Project Name: RMCOHST Application Web App
**Client**: Remington College of Health Science and Technology (RMCOHST)

---

## 1. Introduction
This Software Requirements Specification (SRS) defines the technical and software requirements for the frontend architecture of the RMCOHST Application Web App. It scopes the structural framework, external interfaces, and non-functional compliance standards required for the digital admissions platform.

## 2. System Architecture overview
The frontend is structured as a Single Page Application (SPA) natively utilizing the **Next.js 14+ App Router paradigms** mapping directly to the `src/app` directory.
- **Framework**: Next.js / React
- **Styling Architecture**: Tailwind CSS
- **State & Data Management**: React Context (`AuthContext`, `FieldConfigContext`) supplemented by custom data fetching hooks.
- **Animation Engine**: Framer Motion
- **Iconography**: Lucide React

## 3. Structural Routing & Directories
The platform segments business logic natively via directory routing:
- **`src/app/auth`**: Comprehensive authentication gateways (`login`, `signup`, `forgot-password`, `reset-password`, `verify-email`, `callback`).
- **`src/app/applicant`**: The core student module. Routes encapsulate the `dashboard`, multi-step `application`, `programs` discovery, and secure `payments` processing.
- **`src/app/admissions`**: The admissions staff module, branching into `admission-officer` (task execution) and `head-of-admissions` (assignment and oversight).
- **`src/app/ict-admin`**: Configuration portal for system variables (`departments`, `faculties`, `ssc-qualification`, `programs`).

## 4. Functional Requirements (Software Logic)

### FR1: Centralized API Hook System
- All external data fetching must be executed via the `useGet`, `useApiQuery`, or similar custom network hooks.
- API endpoints map strictly to declarations within the centralized `API_ROUTES` constant to ensure maintainability (e.g., `API_ROUTES.APPLICATION.GET_BY_APPLICANT_ID`).

### FR2: Security and Access Control (NFR-SEC-01)
- The application implements Role-Based Access Control (RBAC). Layout wrappers (`StaffOffcanvas`, `ApplicantOffcanvas`, `SuperAdminOffCanvas`) inject role-specific navigation arrays dynamically based on the verified JWT claims retrieved via `useAuthContext()`.

### FR3: Component State Machines
- **Application Status Module**: A centralized `getStatusDisplay()` helper dynamically computes styling and contextual icons based on strict enum statuses (`DRAFT`, `SUBMITTED`, `UNDER_REVIEW`, `APPROVED`, `PENDING_APPROVAL`, `ADMITTED`, `REJECTED`).
- **Payment Verification**: Payments must follow a strict handshake loop. After navigating from the Paystack gateway, users land on `payments/[reference]` where `PaystackVerificationResponse` triggers to reconcile the transaction with the backend.

### FR4: Form & Validation Paradigms
- Forms utilize standard `CustomForm` abstractions driven by context providers (`useFieldConfigContext`) and `createFieldsConfig` logic to standardize validation schemas (e.g., `loginFormConfig`, `signUpFormConfig`).
- Multi-step layouts seamlessly manage transitions between `BiodataForm`, `SSCQualificationForm`, and `ProgramSpecificQualificationForm`.

## 5. Non-Functional Requirements (NFR)

### NFR-PERF (Performance)
- The UI MUST display loading states intelligently via standard `<Spinner />` components and skeleton outlines while asynchronous operations process.

### NFR-UI (Interface & Responsiveness)
- System layouts rely heavily on responsive grids (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`).
- Navigation menus automatically transition from standard sidebars to hidden offcanvas menus (`-translate-x-full`) depending on viewport bounds captured via `useResizeWindow()`.

## 6. Testing Integrations & Constants
- Identifiers natively map to Cypress/E2E constants exported from `src/test/testIds` (e.g., `ApplicationTestIds`, `loginFormTestIds`, `emailVerificationTestIds`), ensuring a contract between the UI and automated tests.
