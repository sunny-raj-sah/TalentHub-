# TalentHub  

An AI-powered recruitment platform that connects applicants and recruiters through an integrated hiring experience. TalentHub streamlines job discovery, application management, candidate evaluation, and interview preparation with role-based workflows and AI-assisted insights.

---

## Overview

**TalentHub** is a full-stack recruitment platform designed to simplify the hiring process for both applicants and recruiters.

Applicants can explore opportunities, manage their applications, maintain their professional profiles, and prepare for interviews with an AI-powered assistant.

Recruiters can manage job postings, review applications, evaluate candidates, access applicant resumes according to application permissions, and use an AI hiring assistant to gain insights into their recruitment process.

The platform combines a structured backend architecture, secure authentication, centralized frontend state management, and AI-powered functionality to create a streamlined hiring experience.

## Key Features

### 👤 Applicant Portal

- **Job Discovery:** Browse and explore available job opportunities.
- **Job Search:** Search jobs using relevant keywords and available filters.
- **Job Details:** View job descriptions, responsibilities, requirements, employment types, and work modes.
- **Job Applications:** Apply for opportunities and track application progress.
- **Application Management:** View application details and withdraw eligible applications.
- **Bookmarks:** Save interesting job opportunities for later.
- **Applicant Profile:** Manage personal and professional information.
- **Resume Management:** Upload, manage, and access the applicant's resume.
- **Application Tracking:** Monitor application statuses, including Pending, Shortlisted, Rejected, and Withdrawn.
- **AI Interview Preparation:** Get job-specific interview questions, skill recommendations, HR interview guidance, and profile-to-job requirement analysis.

### 🏢 Recruiter Portal

- **Recruiter Dashboard:** View recruitment statistics and recent application activity.
- **Job Management:** Create, update, archive, restore, and manage job postings.
- **Applicant Management:** Review candidates who have applied to recruiter-owned jobs.
- **Application Review:** Evaluate applications and update candidate application statuses.
- **Candidate Evaluation:** Review applicant profiles and relevant resume information.
- **Resume Access:** Access applicant resumes according to application status and authorization rules.
- **Company Profile:** Manage company information, logo, website, and description.
- **Recruitment Analytics:** Monitor job and application statistics.
- **AI Hiring Assistant:** Ask job-specific questions and analyze applicant information to support recruitment decisions.

### 🤖 AI-Powered Assistance

TalentHub integrates AI capabilities into both applicant and recruiter workflows.

**AI Interview Preparation Assistant**

Helps applicants prepare for interviews using the selected job's information and conversation context.

Capabilities include:
- Generating technical interview questions.
- Identifying important skills to prepare.
- Providing common HR questions and sample answers.
- Identifying gaps between applicant profiles and job requirements.
- Maintaining job-specific conversation history.

**AI Hiring Assistant**

Helps recruiters understand applicant information and make more informed recruitment decisions.

Capabilities include:
- Answering questions about a recruiter's selected job.
- Analyzing applicant profiles and available resume information.
- Supporting candidate evaluation.
- Providing insights based on application information and recruitment analytics.
- Maintaining job-specific conversation history.

AI analysis follows application access and data-scoping rules. Withdrawn applicants are excluded by default. A recruiter can explicitly request withdrawn-applicant analysis when appropriate, with their withdrawn status clearly identified. This does not grant manual resume access to withdrawn applications.

---

## Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| React | Component-based user interface |
| JavaScript | Application logic |
| Vite | Frontend development and build tooling |
| Redux Toolkit | Centralized state management |
| React Redux | Connecting React components with Redux |
| React Router | Client-side routing |
| Axios | Backend API communication |
| Bootstrap 5 | Responsive UI and styling |
| Bootstrap Icons | Interface icons |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | REST API and server architecture |
| MongoDB | Database |
| Mongoose | Database modeling and queries |
| JWT | Authentication |
| bcrypt | Password hashing |
| Cloudinary | Resume and media storage |
| Multer | File upload handling |
| Zod | Request validation |
| Morgan | HTTP request logging |
| express-rate-limit | API rate limiting |
| Groq API | AI-powered assistant responses |

### Development Tools

- Git and GitHub
- Postman
- npm
- VS Code

---

## Application Architecture

TalentHub follows a client-server architecture with a React frontend communicating with an Express REST API.

```text
                 TALENTHUB
                     |
          +----------+----------+
          |                     |
     FRONTEND                BACKEND
          |                     |
      React + Vite          Node.js
          |                 Express.js
      React Router              |
          |                Middleware
      Redux Toolkit        Authentication
          |                Authorization
        Axios              Validation (Zod)
          |                Rate Limiting
          |                Request Logging
          |                     |
          +------ REST API -----+
                                |
                    +-----------+-----------+
                    |           |           |
                 MongoDB    Cloudinary   Groq API
                    |           |           |
                 Application   Resume       AI
                   Data        Storage   Assistance
```

### Backend Architecture

The backend is organized into modular layers to separate responsibilities and improve maintainability.

```text
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── services/
│   ├── routes/
│   ├── models/
│   ├── middlewares/
│   ├── validators/
│   ├── utils/
│   └── app.js
├── server.js
├── package.json
└── .env
```

**Main responsibilities:**

- **Routes:** Define API endpoints and connect them with middleware and controllers.
- **Controllers:** Handle HTTP requests and responses.
- **Services:** Contain business logic and database operations.
- **Models:** Define MongoDB document structures and relationships.
- **Middlewares:** Handle authentication, authorization, validation, and request processing.
- **Validators:** Validate incoming request data using Zod.
- **Utils:** Contain reusable helper functions.
- **Config:** Manage application configuration and external service connections.

### Frontend Architecture

The frontend uses feature-based organization to separate application logic, reusable components, pages, and API communication.

```text
frontend/
├── src/
│   ├── api/
│   ├── app/
│   ├── components/
│   ├── features/
│   │   ├── auth/
│   │   ├── jobs/
│   │   ├── applications/
│   │   ├── recruiter/
│   │   └── ...
│   ├── pages/
│   │   ├── applicant/
│   │   ├── recruiter/
│   │   └── ...
│   ├── routes/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── public/
├── index.html
├── package.json
└── .env
```

---

## Authentication and Authorization

TalentHub implements role-based authentication to ensure that applicants and recruiters can access only the functionality permitted for their accounts.

### Authentication Flow

1. Users register or log in using their credentials.
2. The backend validates the request and verifies user credentials.
3. Passwords are stored using secure hashing.
4. JWT-based authentication is used to establish authenticated sessions.
5. Access tokens are used to authorize protected API requests.
6. Refresh-token-based session initialization helps maintain authentication across page reloads.
7. The frontend initializes the authentication state before rendering protected application routes.

### Role-Based Access Control

The platform supports two primary roles:

| Role | Access |
|---|---|
| Applicant | Job discovery, applications, bookmarks, profile, resume management, interview preparation |
| Recruiter | Recruiter dashboard, job management, applicant management, company profile, hiring assistant |

Backend authorization middleware protects role-specific endpoints. Frontend protected routes also prevent users from navigating into unauthorized sections.

### Session Management

- Centralized authentication state using Redux Toolkit.
- Access-token handling through the frontend authentication layer.
- Refresh-token-based session initialization.
- Axios-based API communication with credential support.
- Session-expiration handling to clear invalid authentication state.
- Protected and guest-only route handling.

---

## Redux Toolkit State Management

The frontend uses Redux Toolkit to manage shared application state and asynchronous API operations.

Feature-based slices keep state management organized and predictable.

### Redux Concepts Used

**Slices**

Redux slices define feature-specific state, reducers, and actions.

**Async Thunks**

`createAsyncThunk` handles asynchronous operations such as:
- Login and registration.
- Fetching jobs.
- Creating and updating job postings.
- Fetching applications.
- Updating application statuses.
- Fetching recruiter dashboard information.

**Loading and Error States**

Each feature manages appropriate loading, success, and error states to provide feedback during API operations.

**Centralized Store**

The Redux store combines feature reducers and provides shared application state to React components.

---

## Database Design

TalentHub uses MongoDB with Mongoose for data modeling and persistence.

The main entities support the applicant and recruiter hiring workflows.

| Model / Entity | Responsibility |
|---|---|
| User | Authentication, account information, and user roles |
| Applicant | Applicant-specific profile information |
| Recruiter | Recruiter-specific account information |
| Recruiter Profile | Company information, logo, website, and description |
| Job | Job postings created and managed by recruiters |
| Application | Applicant submissions and application lifecycle |
| Bookmark | Saved job opportunities |

### Important Relationships

- A user has an applicant or recruiter role.
- Applicant-specific information is maintained separately from recruiter-specific information.
- A recruiter can create and manage multiple job postings.
- A job can receive applications from multiple applicants.
- An application connects an applicant with a specific job.
- Applicants can bookmark job opportunities.

These relationships support role-specific data access and application management.

---

## Application Lifecycle

Applications move through defined statuses to represent their progress in the recruitment process.

| Status | Description |
|---|---|
| PENDING | Application has been submitted and is awaiting review. |
| SHORTLISTED | Applicant has been shortlisted by the recruiter. |
| REJECTED | Application has been rejected. |
| WITHDRAWN | Applicant has withdrawn the application. |

Applicants can withdraw eligible applications. Recruiters can review applications and update their statuses according to the recruitment workflow.

Application access, resume access, and AI analysis are handled according to their respective authorization rules.

---

## Resume Management

TalentHub supports applicant resume uploads and recruiter-side resume access.

The resume upload workflow uses:

- Multer memory storage for handling uploaded files.
- PDF file validation.
- MIME type and file-signature validation.
- A maximum upload size of 5 MB.
- Cloudinary for resume storage.
- Authorized resume upload, download, and removal operations.

Resume access is controlled by the backend rather than relying only on frontend visibility.

Recruiters cannot manually access resumes associated with withdrawn applications. AI analysis follows its separate withdrawn-applicant opt-in policy.

---

## Security and Validation

Security and data integrity are important parts of the TalentHub architecture.

| Technology / Mechanism | Purpose |
|---|---|
| JWT | Authenticated API access |
| bcrypt | Password hashing |
| Role-based middleware | Restricts access by user role |
| Zod | Validates request payloads |
| express-rate-limit | Limits excessive API requests |
| Morgan | Logs incoming HTTP requests |
| Multer validation | Handles and restricts file uploads |
| Cloudinary | Manages externally stored resume files |

The backend enforces authorization and validates sensitive operations to help protect user information and application data.

---

## Getting Started

Follow these steps to run TalentHub locally.

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- npm
- [MongoDB](https://www.mongodb.com/)
- [Git](https://git-scm.com/)

You will also need credentials for the external services configured in the backend, including Cloudinary and the Groq API.

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd TalentHub-AI-Powered-Hiring-Platform
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Backend Environment Variables

Create a `.env` file inside the `backend` directory.

Add the environment variables required by your backend configuration. These typically include:

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=your_mongodb_connection_string

JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

GROQ_API_KEY=your_groq_api_key
```

**Important:** These are illustrative configuration names. Use the exact variable names expected by your backend configuration files. Never commit actual credentials or `.env` files.

### 4. Start the Backend

```bash
npm run dev
```

The backend development server runs on:

```text
http://localhost:5000
```

### 5. Install Frontend Dependencies

Open another terminal from the project root:

```bash
cd frontend
npm install
```

### 6. Configure Frontend Environment Variables

Create a `.env` file inside the `frontend` directory.

```env
VITE_API_URL=http://localhost:5000/api
```

Use the API URL expected by your frontend Axios configuration.

### 7. Start the Frontend

```bash
npm run dev
```

Vite will display the local frontend URL in the terminal, typically:

```text
http://localhost:5173
```

You can now open TalentHub in your browser.

---

## Available Development Scripts

The following are common commands. Check each directory's `package.json` for the exact scripts configured in the project.

### Backend

```bash
npm run dev
npm start
```

### Frontend

```bash
npm run dev
npm run build
npm run preview
```

---

## API Structure

The backend exposes REST API endpoints organized around application features.

Representative route groups include:

| Route Group | Responsibility |
|---|---|
| `/api/auth` | Registration, login, session initialization, and logout |
| `/api/jobs` | Job discovery and job details |
| `/api/applications` | Applicant application management |
| `/api/recruiter` | Recruiter dashboard and job management |
| `/api/ai` | AI-powered hiring and interview assistance |

Protected endpoints require valid authentication and appropriate role authorization.

Refer to the backend route files for the complete endpoint list, HTTP methods, and request payloads.

---

## Engineering Highlights

TalentHub demonstrates practical full-stack engineering concepts:

- Full-stack application development using React and Node.js.
- REST API design using Express.js.
- MongoDB data modeling with Mongoose.
- Role-based authentication and authorization.
- JWT-based session management.
- Centralized state management with Redux Toolkit.
- Asynchronous API handling with Redux Thunks.
- Feature-based frontend architecture.
- Modular backend architecture with controllers and services.
- Request validation using Zod.
- API rate limiting and HTTP request logging.
- Secure file upload validation and Cloudinary integration.
- AI integration using the Groq API.
- Context-aware AI assistance for applicants and recruiters.
- Application lifecycle and status management.
- Protected resources and role-specific data access.
- Responsive frontend development using Bootstrap.

---

## Future Improvements

Potential areas for further enhancement include:

- Advanced candidate matching and recommendation systems.
- More detailed recruitment analytics.
- Enhanced interview preparation workflows.
- Automated interview scheduling.
- Notifications for application status updates.
- Additional candidate evaluation insights.

---

## Project Structure

```text
TalentHub-AI-Powered-Hiring-Platform/
│
├── backend/
│   ├── src/
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── .env.example
│
├── .gitignore
└── README.md
```

---

## Author

**Sunny Raj**

- GitHub: [sunny-raj-sah](https://github.com/sunny-raj-sah)
- LinkedIn: [Sunny Raj](https://www.linkedin.com/in/sunny-raj-885588313/)

---

## License

This project is developed as a full-stack application project. Add a `LICENSE` file to the repository if you intend to distribute it under a specific open-source license.

---

**TalentHub – Bringing Applicants and Recruiters Together Through AI-Powered Hiring.**