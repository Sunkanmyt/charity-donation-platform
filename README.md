# Hope Share Platform

**Full-Stack Charity & Campaign Fundraising System**  
_Technical Architecture, API Reference, and Deployment Guide_

---

## 1. Project Overview

**Hope Share Platform** is a full-stack MERN application built to facilitate transparent, community-driven fundraising in Nigerian Naira (₦). It connects donors with verified social initiatives, provides visual milestone tracking, automates transactional email receipts, and equips administrators with comprehensive campaign and donor auditing tools.

---

## 2. Core Feature Highlights

### Public & Donor Experience

- **Interactive Campaign Discovery:** Filter campaigns by active status, category, and fundraising velocity with dynamic milestone progress bars. Active causes rank above completed ones.
- **Over-funding & Milestone Recognition:** Campaigns remain open past 100% of their target to capture real-world logistical overhead, featuring a dedicated "Campaign Goal Met" status until formally concluded by an administrator.
- **Anonymous & Attributed Giving:** Donors can contribute custom or preset amounts with either public attribution or privacy-shielded anonymous listings.
- **Transactional Email Receipts:** Email receipts sent through the **Brevo REST API** over HTTPS, featuring explicit transaction IDs, donor details, and Naira currency formatting. Using HTTPS instead of SMTP avoids the outbound mail-port restrictions common on cloud hosting platforms.
- **Account Activity Emails:** A verification link on registration (valid for 24 hours), plus background notices for logins, profile updates and password changes. These never block the request that triggers them.
- **Authenticated Donor Dashboard:** Dedicated interface displaying aggregated lifetime contributions (`totalAmount`) and personal donation histories.
- **Profile & Avatar Management:** A settings page for updating personal details, changing passwords, and uploading a profile photo (handled by Multer and stored on Cloudinary).

### Administrative Management Center

- **Campaign Lifecycle CRUD & Archiving:** Create, update, toggle completion status, and delete (archive) campaigns with integrated Cloudinary banner image hosting.
- **Audit-Safe Soft Deletion:** Deleting a campaign archives it (`isDeleted: true`) instead of removing it from MongoDB. Its donation records and every donor's lifetime total stay intact.
- **Paginated User Directory:** Inspect all registered platform accounts, account activity statuses, and registration timestamps.
- **User Contribution Audit:** On-demand inspection modals displaying complete donation ledgers per user across all campaigns.
- **Completion-Aware Ranking:** Completed campaigns stay publicly visible but rank below active ones. Admins can archive them from the admin panel when they are no longer needed.

### Security & Session Resilience

- **Proactive Sliding JWT Session:** Client-side background token refresh triggered 60 seconds prior to expiration via `jwt-decode`.
- **Inactivity Guard:** Five-minute user activity tracking prevents background session refresh loops on abandoned client tabs.
- **Non-blocking Transaction Handling:** Email delivery exceptions are fully isolated, ensuring Brevo API errors, timeouts, or rate limits never cause rollbacks or 500 errors on valid monetary donations.
- **Role-Based Access Control (RBAC):** Backend route protection enforcing standard donor vs. platform administrator privileges (`protect`, `authorize("admin")`).

---

## 3. Technology Stack

| Layer              | Technologies                                                             |
| ------------------ | ------------------------------------------------------------------------ |
| **Frontend**       | React 18, React Router v6, Axios, Lucide Icons, Custom CSS (`index.css`) |
| **Backend**        | Node.js, Express.js (REST Architecture)                                  |
| **Database**       | MongoDB Atlas, Mongoose ODM                                              |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs, jwt-decode                              |
| **Media Pipeline** | Cloudinary CDN, Multer (campaign banners and user avatars)               |
| **Mail Services**  | Brevo Transactional Email (HTTPS REST API, called with native `fetch`)   |

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
│   │   ├── utils/              # Helper utilities (sendEmail, formatting, error handling)
│   │   └── server.js           # Express app initialization & route mounting
│   ├── .env
│   ├── .gitignore
│   └── package.json
└── frontend/
    ├── public/                 # Favicon, logo, default-avatar.png
    ├── src/
    │   ├── components/         # Reusable UI (Navbar, DonationModal, ErrorBanner)
    │   ├── context/            # AuthContext (sliding token refresh & user sync)
    │   ├── pages/              # ProfilePage, AdminDashboard, AdminUsers, CampaignDetails, etc.
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
TZ=Africa/Lagos

# Database Connection
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.z7pbyia.mongodb.net/CharityDonationApp?retryWrites=true&w=majority

# JWT Credentials
JWT_SECRET=your_jwt_private_secret_key_here
JWT_EXPIRES_IN=1h

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Brevo Transactional Email API (HTTPS)
BREVO_API_KEY=xkeysib-your_brevo_api_key_here
EMAIL_USER=your_verified_sender@example.com
```

`EMAIL_USER` must be a sender address that has been verified in your Brevo account.

`TZ` sets the server timezone (`Africa/Lagos` is WAT, UTC+1). Cloud platforms and containers default to UTC, so without it the timestamps in transactional emails such as donation receipts and login alerts would be an hour off local time.

### Frontend Configuration (`frontend/.env`)

```env
# For Vite:
VITE_API_BASE_URL=http://localhost:3000/api

# For Create React App:
REACT_APP_API_BASE_URL=http://localhost:3000/api
```

For a deployed build, set `CLIENT_URL` (backend) and `VITE_API_BASE_URL` (frontend) to your live frontend and API URLs.

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

Full request and response details for each group are in `users-api.md`, `campaigns-api.md` and `donations-api.md`.

### User & Authentication Routes (`/api/users`)

| Method | Route                      | Access  | Description                                                           |
| ------ | -------------------------- | ------- | --------------------------------------------------------------------- |
| POST   | `/api/users/register`      | Public  | Register a new donor account; sends verification email                |
| GET    | `/api/users/verify/:token` | Public  | Verify email address via single-use SHA-256 token                     |
| POST   | `/api/users/login`         | Public  | Authenticate credentials and return signed JWT                        |
| GET    | `/api/users/profile`       | Private | Retrieve authenticated user profile and verification status           |
| PUT    | `/api/users/profile`       | Private | Update account details (firstName, lastName, phone) and upload avatar |
| PUT    | `/api/users/password`      | Private | Update user password                                                  |
| POST   | `/api/users/refresh`       | Private | Proactively renew expiring JWT session (sliding window)               |
| GET    | `/api/users`               | Admin   | Retrieve paginated system user directory                              |

### Campaign Management Routes (`/api/campaigns`)

| Method | Route                | Access | Description                                                                                |
| ------ | -------------------- | ------ | ------------------------------------------------------------------------------------------ |
| GET    | `/api/campaigns`     | Public | List campaigns with optional search, category, and status filters (all, active, completed) |
| GET    | `/api/campaigns/:id` | Public | Retrieve full details for a single campaign                                                |
| POST   | `/api/campaigns`     | Admin  | Create a new campaign with banner upload                                                   |
| PUT    | `/api/campaigns/:id` | Admin  | Update campaign text, target amount, or status                                             |
| DELETE | `/api/campaigns/:id` | Admin  | Soft-delete (archive) a campaign while preserving its donation records                     |

### Donation & Transaction Routes (`/api/donations`)

| Method | Route                                 | Access  | Description                                                  |
| ------ | ------------------------------------- | ------- | ------------------------------------------------------------ |
| POST   | `/api/donations`                      | Private | Process donation, increment total, and trigger receipt       |
| GET    | `/api/donations/my`                   | Private | Get authenticated user's donation history and lifetime total |
| GET    | `/api/donations/campaign/:campaignId` | Private | Retrieve supporters/donations for a cause                    |
| GET    | `/api/donations/user/:userId`         | Admin   | Get full donation audit ledger for a specific user           |

---

## 8. Database Architecture

### Users Collection (`User.js`)

- `firstName`, `lastName` (String, Required, Trimmed)
- `email` (String, Required, Unique, Indexed, Lowercase, Trimmed)
- `password` (String, Required, Min 6, Hashed via bcrypt, excluded from queries by default)
- `phone` (String, Optional, Trimmed)
- `profileImageUrl` (String, Default: `'/default-avatar.png'`, Cloudinary URI once uploaded)
- `role` (String, Enum: `['donor', 'admin']`, Default: `'donor'`)
- `isVerified` (Boolean, Default: `false`)
- `verificationTokenHash` (String, SHA-256 hash of the emailed token, cleared once verified)
- `verificationTokenExpires` (Date, 24 hours after registration, cleared once verified)
- `isActive` (Boolean, Default: `true`)
- `lastLogin` (Date, Optional)
- `timestamps` (`createdAt`, `updatedAt`)

### Campaigns Collection (`Campaign.js`)

- `title` (String, Required, Trimmed, Max 120 characters)
- `category` (String, Required, Enum: `['Education', 'Healthcare', 'Disaster Relief', 'Community Development']`)
- `targetAmount` (Number, Required, Min 10)
- `raisedAmount` (Number, Default: `0`, Min 0)
- `description` (String, Required)
- `imageUrl` (String, Cloudinary URI, defaults to a placeholder image)
- `status` (String, Enum: `['active', 'completed']`, Default: `'active'`)
- `isDeleted` (Boolean, Default: `false`, Indexed)
- `deletedAt` (Date, Default: `null`, Populated when archived)
- `createdBy` (ObjectId, Reference: `User`, Required)
- `timestamps` (`createdAt`, `updatedAt`)

### Donations Collection (`Donation.js`)

- `campaign` (ObjectId, Reference: `Campaign`, Required)
- `donor` (ObjectId, Reference: `User`, Required)
- `amount` (Number, Required, Min 1)
- `message` (String, Optional, Max 300 characters)
- `isAnonymous` (Boolean, Default: `false`)
- `status` (String, Enum: `['pending', 'successful', 'failed']`, Default: `'successful'`)
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

### Non-Blocking Transaction & Email Flow

```text
Client submits POST /api/donations
          │
          ▼
Database writes:
  1. Save Donation record
  2. Increment Campaign.raisedAmount via $inc
          │
          ▼
Isolate email dispatcher in try/catch block:
  POST https://api.brevo.com/v3/smtp/email
  ├── Failure ──► Log warning to console, do NOT throw 500
  └── Success ──► Brevo delivers HTML receipt to donor
          │
          ▼
Return HTTP 201 Created to DonationModal
```

### Avatar Upload Flow

```text
Client submits PUT /api/users/profile (multipart/form-data)
          │
          ▼
Multer parses the profileImageUrl file (max 5 MB, jpg/jpeg/png/webp)
          │
          ▼
Image is uploaded to Cloudinary
          │
          ▼
User.profileImageUrl is updated with the Cloudinary URL
          │
          ▼
Updated user returned; AuthContext syncs the new avatar in the UI
```

---

## 10. Verification & Testing

### Testing Inactive Session Expiry

1. In `backend/.env`, set `JWT_EXPIRES_IN=2m`.
2. In `frontend/src/context/AuthContext.jsx`, set `ACTIVE_WINDOW = 10 * 1000`.
3. Log into the application and leave the browser unattended for 60 seconds.
4. Verify the client auto-logs out and redirects to `/login` without console errors.

### Testing Transactional Emails

1. Confirm `BREVO_API_KEY` and a verified `EMAIL_USER` sender are set in `backend/.env`.
2. Submit a test contribution via the donation modal.
3. Confirm the modal returns a success banner immediately.
4. Check the donor inbox (or the Brevo transactional logs and backend console) to ensure the email was sent without blocking the HTTP response.

### Testing Avatar Upload

1. Log in and open the profile page.
2. Upload a JPG, PNG or WEBP image under 5 MB.
3. Confirm the new avatar appears immediately and that `profileImageUrl` in the `GET /api/users/profile` response is a Cloudinary URL.

---

## 11. License

Distributed under the MIT License. See `LICENSE` for more information.
