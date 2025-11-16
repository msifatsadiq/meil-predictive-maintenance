# MEIL Dashboard - Quick Setup Guide

## 🚀 5-Minute Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Follow the wizard to create your project

### 3. Enable Firebase Services

**Authentication:**
- Go to Authentication → Sign-in method
- Enable "Email/Password"

**Firestore:**
- Go to Firestore Database
- Click "Create database"
- Select "Start in test mode"
- Choose a location

### 4. Get Firebase Config
1. Go to Project Settings (gear icon)
2. Scroll to "Your apps" section
3. Click the web icon (</>)
4. Copy the config object

### 5. Update Configuration
Edit `src/firebase/config.js` and paste your config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 6. Create Demo Users

**Option A: Via Firebase Console**
1. Go to Authentication → Users
2. Click "Add user"
3. Create these users:
   - `admin@meil.com` / `admin123`
   - `engineer@meil.com` / `engineer123`
   - `viewer@meil.com` / `viewer123`

4. Go to Firestore → Start collection
5. Collection ID: `users`
6. For each user, create a document with their UID:
   ```json
   {
     "email": "admin@meil.com",
     "name": "Admin User",
     "role": "admin"
   }
   ```

### 7. Deploy Security Rules
1. Go to Firestore → Rules
2. Copy contents from `firestore.rules` file
3. Click "Publish"

### 8. Run the App
```bash
npm run dev
```

Open http://localhost:5173 and login with:
- **Admin**: admin@meil.com / admin123

### 9. Add Sample Data
Use the app to add:
1. Machines (go to Machines → Add Machine)
2. Downtime Events (go to Events → Add Event)
3. Work Orders (go to Work Orders → Create Work Order)

## ✅ You're Done!

Your dashboard is now ready to use. Explore the features:
- 📊 Dashboard - View KPIs and charts
- ⚙️ Machines - Manage equipment
- 📋 Events - Track downtime
- 🔧 Work Orders - Manage maintenance tasks

## 🆘 Troubleshooting

**Can't login?**
- Check Firebase config is correct
- Verify user exists in Authentication
- Verify user role exists in Firestore users collection

**No data showing?**
- Add machines first
- Then add events and work orders

**Charts not rendering?**
- You need events data with dates
- Add at least 3-5 events to see trends

## 📚 Next Steps

- Customize the branding (logo, colors)
- Add more machines and categories
- Integrate with real equipment data
- Set up email notifications
- Add export to PDF/Excel features
