# 🏭 MEIL Predictive Maintenance Dashboard

A production-ready **Predictive Maintenance Dashboard** for **MEIL - Maintenance Engineering Insider Ltd**. Built with React, Firebase, and Tailwind CSS.

![Dashboard Preview](https://img.shields.io/badge/React-19.2.0-blue) ![Firebase](https://img.shields.io/badge/Firebase-Latest-orange) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-cyan)

## ✨ Features

### 🎯 Core Functionality
- **Real-time Dashboard** with KPIs and charts
- **Machine Management** with CRUD operations
- **Downtime Event Tracking** with automatic duration calculation
- **Work Order Management** with priority and status tracking
- **Role-based Access Control** (Admin, Engineer, Viewer)
- **Dark Mode** support
- **Responsive Design** for all devices

### 📊 Key Performance Indicators (KPIs)
- **MTBF** (Mean Time Between Failures)
- **MTTR** (Mean Time To Repair)
- **Total Downtime** tracking
- **Availability** percentages
- **Machine Status** distribution
- **Downtime trends** visualization

### 🔐 Authentication & Authorization
- Firebase Email/Password authentication
- Three user roles:
  - **Admin**: Full access to all features
  - **Engineer**: Can create/edit events and work orders
  - **Viewer**: Read-only access
- Protected routes with role-based permissions

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Firebase account (free tier works fine)

### Installation

1. **Clone and Install Dependencies**
```bash
cd predictive-maintenance-dashboard
npm install
```

2. **Set Up Firebase**

   a. Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   
   b. Enable Authentication:
      - Go to Authentication → Sign-in method
      - Enable "Email/Password"
   
   c. Create Firestore Database:
      - Go to Firestore Database
      - Click "Create database"
      - Start in **test mode** (we'll add rules later)
   
   d. Get your Firebase config:
      - Go to Project Settings → General
      - Under "Your apps", select Web app
      - Copy the configuration object

3. **Configure Firebase in Your App**

   Edit `src/firebase/config.js`:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT_ID.appspot.com",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

4. **Run the Development Server**
```bash
npm run dev
```

The app will open at `http://localhost:5173`

## 🌱 Seeding Demo Data

### Option 1: Manual Seeding (Recommended)

Since the seeder script needs ES modules configuration, you can manually create demo data:

1. **Create Demo Users** (Firebase Console → Authentication):
   - **Admin**: `admin@meil.com` / `admin123`
   - **Engineer**: `engineer@meil.com` / `engineer123`
   - **Viewer**: `viewer@meil.com` / `viewer123`

2. **Add User Roles** (Firestore → users collection):
   For each user, create a document with their UID as the document ID:
   ```json
   {
     "email": "admin@meil.com",
     "role": "admin",
     "name": "Admin User"
   }
   ```

3. **Use the App to Add Data**:
   - Login as admin
   - Add machines through the UI
   - Create downtime events
   - Create work orders

### Option 2: Automated Seeding

1. Update `scripts/seedData.js` with your Firebase config
2. Add to `package.json`:
   ```json
   {
     "type": "module",
     "scripts": {
       "seed": "node scripts/seedData.js"
     }
   }
   ```
3. Run: `npm run seed`

## 🔧 Firebase Security Rules

Deploy the security rules to protect your data:

1. Go to Firestore Database → Rules
2. Copy the contents from `firestore.rules`
3. Click "Publish"

The rules ensure:
- All authenticated users can read data
- Only Admin and Engineer can create/edit
- Admin can delete anything
- Engineers can only delete their own events

## 📁 Project Structure

```
src/
├── components/        # Reusable components
│   └── ProtectedRoute.jsx
├── firebase/          # Firebase configuration
│   ├── config.js      # Firebase initialization
│   ├── auth.js        # Authentication helpers
│   └── firestore.js   # Database operations
├── layout/            # Layout components
│   ├── Layout.jsx     # Main layout wrapper
│   ├── Sidebar.jsx    # Navigation sidebar
│   └── Navbar.jsx     # Top navigation bar
├── pages/             # Page components
│   ├── Login.jsx      # Login page
│   ├── Dashboard.jsx  # Overview dashboard
│   ├── Machines.jsx   # Machines list
│   ├── MachineDetail.jsx  # Machine details
│   ├── Events.jsx     # Downtime events
│   └── WorkOrders.jsx # Work orders
├── store/             # State management
│   ├── authStore.js   # Authentication state
│   └── appStore.js    # Application state
├── utils/             # Utility functions
│   ├── kpiCalculations.js  # KPI algorithms
│   └── helpers.js     # Helper functions
├── App.jsx            # Main app component
└── main.jsx           # Entry point
```

## 🎨 Features Breakdown

### Dashboard Page
- Total machines count
- Running vs. stopped machines
- Total downtime (last 7 days)
- Open work orders count
- Downtime trend chart (bar chart)
- Machine status distribution (pie chart)
- Recent events and work orders

### Machines Page
- List all machines in a table
- Search by name or asset code
- Filter by status
- Add/Edit/Delete machines (Admin/Engineer only)
- View machine details
- Status badges (Running, Stopped, Faulted, Under Maintenance)
- Criticality indicators (High, Medium, Low)

### Machine Detail Page
- Complete machine information
- KPIs specific to this machine:
  - MTBF calculation
  - MTTR calculation
  - Total downtime
  - Number of failures
- Recent downtime events list
- Recent work orders list
- Links to view all events/work orders

### Events (Downtime) Page
- Log downtime events
- Automatic duration calculation
- Filter by machine
- Filter by category (Mechanical, Electrical, Breakdown, etc.)
- Edit/Delete events (Admin/Engineer only)
- Categories and reasons tracking

### Work Orders Page
- Create and manage work orders
- Priority levels (High, Medium, Low)
- Status tracking (Open, In Progress, Closed)
- Due date management
- Assign to technicians
- Filter by status and priority

## 🧮 KPI Calculations

### MTBF (Mean Time Between Failures)
```
MTBF = Total Operating Time / Number of Failures
```
Measures average time machine operates before failure.

### MTTR (Mean Time To Repair)
```
MTTR = Total Downtime / Number of Failures
```
Measures average time to repair and restore operation.

### Availability
```
Availability = (Total Time - Downtime) / Total Time × 100%
```
Percentage of time machine is operational.

## 🎭 User Roles & Permissions

| Feature | Admin | Engineer | Viewer |
|---------|-------|----------|--------|
| View Dashboard | ✅ | ✅ | ✅ |
| View Machines | ✅ | ✅ | ✅ |
| Add/Edit Machines | ✅ | ✅ | ❌ |
| Delete Machines | ✅ | ❌ | ❌ |
| View Events | ✅ | ✅ | ✅ |
| Add/Edit Events | ✅ | ✅ | ❌ |
| Delete Events | ✅ | Own only | ❌ |
| View Work Orders | ✅ | ✅ | ✅ |
| Add/Edit Work Orders | ✅ | ✅ | ❌ |
| Delete Work Orders | ✅ | ❌ | ❌ |

## 🚢 Deployment

### Deploy to Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in your project:
```bash
firebase init
```
   - Select "Hosting"
   - Choose your Firebase project
   - Set public directory to: `dist`
   - Configure as single-page app: Yes
   - Don't overwrite index.html

4. Build and deploy:
```bash
npm run build
firebase deploy
```

Your app will be live at: `https://YOUR_PROJECT_ID.web.app`

### Deploy to Vercel/Netlify

1. Push your code to GitHub
2. Connect your repo to Vercel/Netlify
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variables if needed

## 🔑 Demo Credentials

After seeding data, use these credentials to test different roles:

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| Admin | admin@meil.com | admin123 | Full access |
| Engineer | engineer@meil.com | engineer123 | Can create/edit |
| Viewer | viewer@meil.com | viewer123 | Read-only |

## 🛠️ Tech Stack

- **Frontend**: React 19.2 + Vite
- **Styling**: Tailwind CSS 3.x
- **Routing**: React Router 6
- **State Management**: Zustand
- **Charts**: Recharts
- **Backend**: Firebase (Firestore + Auth)
- **Date Handling**: date-fns

## 📦 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🤝 Support

For issues or questions:
1. Check Firebase console for errors
2. Verify Firebase config is correct
3. Ensure Firestore rules are deployed
4. Check browser console for errors

## 📝 License

MIT License - feel free to use this project for your organization.

---

**Built with ❤️ for MEIL - Maintenance Engineering Insider Ltd**

*Production-ready predictive maintenance dashboard for modern manufacturing operations.*

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
