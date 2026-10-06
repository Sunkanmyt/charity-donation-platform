# Hope Share Platform

**Full-Stack Charity & Campaign Fundraising System**  
_Technical Architecture, API Reference, and Deployment Guide_

---

## 1. Project Overview

**Hope Share Platform** is a full-stack MERN application built to facilitate transparent, community-driven fundraising in Nigerian Naira (₦). It connects donors with verified social initiatives, provides visual milestone tracking, automates transactional email receipts, and equips administrators with comprehensive campaign and donor auditing tools.

---

## 2. Core Feature Highlights

### Public & Donor Experience

- **Interactive Campaign Discovery:** Filter campaigns by active status, category, and fundraising velocity with dynamic milestone progress bars.
- **Over-funding & Milestone Recognition:** Campaigns remain open past 100% of their target to capture real-world logistical overhead, featuring a dedicated "Campaign Goal Met" status until formally concluded by an administrator.
- **Anonymous & Attributed Giving:** Donors can contribute custom or preset amounts with either public attribution or privacy-shielded anonymous listings.
- **Automated SMTP Receipts:** Real-time email receipts generated via Nodemailer featuring explicit transaction IDs, donor details, and Naira currency formatting.
- **Authenticated Donor Dashboard:** Dedicated interface tracking lifetime contributions and personal donation histories.

### Administrative Management Center

- **Campaign Lifecycle CRUD:** Create, update, toggle completion status, and remove campaigns with integrated Cloudinary banner image hosting.
- **Paginated User Directory:** Inspect all registered platform accounts, account activity statuses, and registration timestamps.
- **User Contribution Audit:** On-demand inspection modals displaying complete donation ledgers per user across all campaigns.
- **Automated Retention Filtering:** Completed campaigns are automatically phased out of public discovery 14 days after completion while remaining accessible in administrative logs.

### Security & Session Resilience

- **Proactive Sliding JWT Session:** Client-side background token refresh triggered 60 seconds prior to expiration via `jwt-decode`.
- **Inactivity Guard:** Five-minute user activity tracking prevents background session refresh loops on abandoned client tabs.
- **Non-blocking Transaction Handling:** Email delivery exceptions are fully isolated, ensuring network/SMTP failures never cause rollbacks or 500 errors on valid monetary donations.
- **Role-Based Access Control (RBAC):** Backend route protection enforcing standard user vs. platform administrator privileges (`protect`, `authorize("admin")`).

---

## 3. Technology Stack

| Layer              | Technologies                                                |
| :----------------- | :---------------------------------------------------------- |
| **Frontend**       | React 18, React Router v6, Axios, Lucide Icons, Vanilla CSS |
| **Backend**        | Node.js, Express.js (REST Architecture)                     |
| **Database**       | MongoDB Atlas, Mongoose ODM                                 |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs, jwt-decode                 |
| **Media Pipeline** | Cloudinary CDN, Multer storage engine                       |
| **Mail Services**  | Nodemailer, Google SMTP (App Passwords)                     |

---

## 4. Project Directory Layout

```text
charity-donation-platform/
├── backend/
│   ├── src/
│   │   ├── config/             # DB connection (MongoDB Atlas) & Cloudinary setup
│   │   ├── controllers/        # userController, campaignController, donationController
│   │   ├── middleware/         # auth (protect, authorize) & upload (multer/cloudinary)
│   │   ├── models/             # User, Campaign, Donation schemas
│   │   ├── routes/             # userRoutes, campaignRoutes, donationRoutes
│   │   ├── services/           # Third-party integrations & mail dispatcher (emailService)
│   │   ├── templates/          # HTML email templates (donation receipts, notifications)
│   │   ├── utils/              # Helper utilities (formatting, error handling)
│   │   └── server.js           # Express app initialization & route mounting
│   ├── .env
│   ├── .gitignore
│   └── package.json
└── frontend/
    ├── public/                 # Favicon and Logo
    ├── src/
    │   ├── components/         # Reusable UI (Navbar, DonationModal, ErrorBanner)
    │   ├── context/            # AuthContext (sliding token refresh)
    │   ├── pages/              # AdminDashboard, AdminUsers, CampaignDetails, etc.
    │   ├── services/           # Axios instance & request interceptors (api.js)
    │   ├── utils/              # Currency/date formatters (formatNaira)
    │   └── App.jsx             # React Router routing configuration
    ├── .env
    ├── .gitignore
    └── package.json
```

---

## 5. Environment Variables

### Backend Configuration (`backend/.env`)

```env
# Server Runtime
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database Connection
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.z7pbyia.mongodb.net/CharityDonationApp?retryWrites=true&w=majority

# JWT Credentials
JWT_SECRET=your_jwt_private_secret_key_here
JWT_EXPIRE=1h

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Services (Gmail SMTP / Google App Password)
EMAIL_USER=your_verified_email@gmail.com
EMAIL_PASS=your_16_digit_app_password
EMAIL_FROM_NAME="Hope Share Platform"
```

### Frontend Configuration (`frontend/.env`)

```env
# For Vite:
VITE_API_BASE_URL=http://localhost:3000/api

# For Create React App:
REACT_APP_API_BASE_URL=http://localhost:3000/api
```

---

## 6. Installation & Local Development

### 1. Repository Setup

```bash
git clone https://github.com/your-username/charity-donation-platform.git
cd charity-donation-platform
```

### 2. Backend Initialization

```bash
cd backend
npm install
npm run dev
# Backend API runs on http://localhost:3000
```

### 3. Frontend Initialization

```bash
# In a separate terminal window:
cd frontend
npm install
npm run dev
# Frontend interface runs on http://localhost:5173
```

---

## 7. REST API Documentation

### User & Authentication Routes (`/api/users`)

| Method | Route                      | Access  | Description                                                     |
| ------ | -------------------------- | ------- | --------------------------------------------------------------- |
| POST   | `/api/users/register`      | Public  | Register a new donor or admin account; sends verification email |
| GET    | `/api/users/verify/:token` | Public  | Verify email address via single-use SHA-256 token               |
| POST   | `/api/users/login`         | Public  | Authenticate credentials and return signed JWT                  |
| GET    | `/api/users/profile`       | Private | Retrieve authenticated user profile and verification status     |
| PUT    | `/api/users/profile`       | Private | Update account details (firstName, lastName, phone, address)    |
| PUT    | `/api/users/password`      | Private | Update user password                                            |
| POST   | `/api/users/refresh`       | Private | Proactively renew expiring JWT session (sliding window)         |
| GET    | `/api/users`               | Admin   | Retrieve paginated system user directory                        |

### Campaign Management Routes (`/api/campaigns`)

| Method | Route                | Access | Description                                    |
| ------ | -------------------- | ------ | ---------------------------------------------- |
| GET    | `/api/campaigns`     | Public | Get active and recently completed causes       |
| GET    | `/api/campaigns/:id` | Public | Retrieve full details for a single campaign    |
| POST   | `/api/campaigns`     | Admin  | Create a new campaign with banner upload       |
| PUT    | `/api/campaigns/:id` | Admin  | Update campaign text, target amount, or status |
| DELETE | `/api/campaigns/:id` | Admin  | Permanently delete a campaign record           |

### Donation & Transaction Routes (`/api/donations`)

| Method | Route                                 | Access  | Description                                            |
| ------ | ------------------------------------- | ------- | ------------------------------------------------------ |
| POST   | `/api/donations`                      | Private | Process donation, increment total, and trigger receipt |
| GET    | `/api/donations/my`                   | Private | Get authenticated user's donation history              |
| GET    | `/api/donations/campaign/:campaignId` | Private | Retrieve supporters/donations for a cause              |
| GET    | `/api/donations/user/:userId`         | Admin   | Get full donation audit ledger for a specific user     |

---

## 8. Database Architecture

### Users Collection (`User.js`)

- `firstName`, `lastName` (String, Required)
- `email` (String, Required, Unique, Indexed)
- `password` (String, Required, Hashed via bcrypt)
- `phone` (String, Optional)
- `role` (String, Enum: `['user', 'admin']`, Default: `'user'`)
- `isVerified` (Boolean, Default: `false`)
- `isActive` (Boolean, Default: `true`)
- `timestamps` (`createdAt`, `updatedAt`)

### Campaigns Collection (`Campaign.js`)

- `title` (String, Required, Trimmed)
- `category` (String, Required)
- `targetAmount` (Number, Required)
- `raisedAmount` (Number, Default: `0`)
- `description` (String, Required)
- `imageUrl` (String, Cloudinary URI)
- `status` (String, Enum: `['active', 'completed']`, Default: `'active'`)
- `completedAt` (Date, Default: `null`, Populated on completion)
- `createdBy` (ObjectId, Reference: `User`)
- `timestamps` (`createdAt`, `updatedAt`)

### Donations Collection (`Donation.js`)

- `campaign` (ObjectId, Reference: `Campaign`, Required, Indexed)
- `donor` (ObjectId, Reference: `User`, Required, Indexed)
- `amount` (Number, Required, Positive integer)
- `message` (String, Optional)
- `isAnonymous` (Boolean, Default: `false`)
- `timestamps` (`createdAt`, `updatedAt`)

---

## 9. Key Architectural Flows

### Sliding Token Refresh Workflow

```text
User Logs In ──► Client records token exp claim via jwt-decode
                       │
                       ▼
           Set setTimeout Delay: (exp - now - 60s)
                       │
                       ▼ (60s before expiry)
      User active within last 5 minutes?
          ├── NO  ──► Execute logout() & purge local storage
          └── YES ──► POST /api/users/refresh
                            │
                            ▼
              Backend validates current token & issues new JWT
                            │
                            ▼
              Client updates localStorage & resets timer cycle
```

### Non-Blocking Transaction Flow

```text
Client submits POST /api/donations
          │
          ▼
Database transaction:
  1. Save Donation record
  2. Increment Campaign.raisedAmount via $inc
          │
          ▼
Isolate Email Transporter in try/catch block:
  ├── SMTP Failure  ──► Log warning to console, do NOT throw 500
  └── SMTP Success  ──► Mailer sends HTML receipt to donor
          │
          ▼
Return HTTP 201 Created to DonationModal
```

---

## 10. Verification & Testing

### Testing Inactive Session Expiry

1. In `backend/.env`, set `JWT_EXPIRE=2m`.
2. In `frontend/src/context/AuthContext.jsx`, set `ACTIVE_WINDOW = 10 * 1000`.
3. Log into the application and leave the browser unattended for 60 seconds.
4. Verify the client auto-logs out and redirects to `/login` without console errors.

### Testing Transactional Emails

1. Submit a test contribution via the donation modal.
2. Confirm the modal returns a success banner immediately.
3. Check the donor inbox (or backend logs) to ensure the email was received without blocking the HTTP response.

---

## 11. License

Distributed under the MIT License. See `LICENSE` for more information.
