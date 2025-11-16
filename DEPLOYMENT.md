# 🚀 DEPLOYMENT CHECKLIST

## Pre-Deployment Checklist

### ✅ Code Setup
- [x] All dependencies installed (`npm install`)
- [x] Firebase config updated in `src/firebase/config.js`
- [x] Tailwind CSS configured
- [x] All pages created
- [x] All components created
- [x] Routes configured
- [x] State management setup

### ✅ Firebase Setup
- [ ] Firebase project created
- [ ] Authentication enabled (Email/Password)
- [ ] Firestore database created
- [ ] Demo users created in Authentication
- [ ] User roles added to Firestore `users` collection
- [ ] Security rules deployed from `firestore.rules`

### ✅ Testing
- [ ] App runs locally (`npm run dev`)
- [ ] Login works for all user roles
- [ ] Dashboard displays correctly
- [ ] Can add machines
- [ ] Can add events
- [ ] Can add work orders
- [ ] Charts render with data
- [ ] Dark mode works
- [ ] Mobile responsive

### ✅ Production Build
- [ ] Build succeeds (`npm run build`)
- [ ] Preview works (`npm run preview`)
- [ ] No console errors
- [ ] All routes work
- [ ] Images/assets load

## Deployment Options

### Option 1: Firebase Hosting (Recommended)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize (first time only)
firebase init

# Select:
# - Hosting
# - Use existing project
# - Public directory: dist
# - Single-page app: Yes
# - GitHub deploys: No

# Build and deploy
npm run build
firebase deploy

# Your app is live at:
# https://YOUR_PROJECT_ID.web.app
```

### Option 2: Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Set build command: `npm run build`
5. Set output directory: `dist`
6. Deploy!

### Option 3: Netlify

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. New site from Git
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Deploy!

## Post-Deployment Steps

1. **Test all user roles**
   - Login as admin
   - Login as engineer
   - Login as viewer
   - Verify permissions work

2. **Add production data**
   - Add your actual machines
   - Import historical downtime events
   - Create real work orders

3. **Configure monitoring** (Optional)
   - Set up Firebase Analytics
   - Enable error reporting
   - Configure performance monitoring

4. **Set up backups** (Optional)
   - Enable Firestore backup
   - Export important data regularly

5. **Customize branding**
   - Update logo
   - Change color scheme in `tailwind.config.js`
   - Update company name throughout

## Environment Variables (Optional)

For production, you can use environment variables:

1. Create `.env.local`:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

2. Update `src/firebase/config.js`:
```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

## Troubleshooting

### Build Errors
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Firebase Deploy Errors
```bash
# Re-login
firebase logout
firebase login

# Check project
firebase projects:list
firebase use YOUR_PROJECT_ID
```

### Firestore Permission Errors
- Go to Firebase Console → Firestore → Rules
- Copy contents from `firestore.rules`
- Click "Publish"

## Performance Optimization (Optional)

1. **Enable compression** in Firebase hosting
2. **Add lazy loading** for routes:
```javascript
const Dashboard = lazy(() => import('./pages/Dashboard'));
```
3. **Optimize images** in `public/` folder
4. **Enable service worker** for offline support

## Security Checklist

- [ ] Firebase security rules deployed
- [ ] Authentication required for all routes
- [ ] Role-based permissions enforced
- [ ] No API keys exposed in frontend
- [ ] HTTPS enabled (automatic with Firebase/Vercel/Netlify)
- [ ] CORS configured properly

## Monitoring Setup (Optional)

### Firebase Analytics
```javascript
// Add to src/firebase/config.js
import { getAnalytics } from 'firebase/analytics';
export const analytics = getAnalytics(app);
```

### Error Tracking
Consider adding:
- Sentry
- LogRocket
- Firebase Crashlytics

## Backup Strategy

1. **Firestore Export** (daily/weekly)
```bash
gcloud firestore export gs://YOUR_BUCKET/backups
```

2. **Code Repository**
- Keep GitHub/GitLab repo updated
- Tag releases
- Maintain changelog

## Scaling Considerations

As your app grows:
1. Enable Firestore indexes for complex queries
2. Implement pagination for large datasets
3. Add caching with React Query
4. Consider CDN for assets
5. Upgrade Firebase plan if needed

## Support

If you encounter issues:
1. Check browser console for errors
2. Check Firebase Console for logs
3. Verify all configurations are correct
4. Test with demo credentials first
5. Review documentation files

---

**🎉 Congratulations on deploying your Predictive Maintenance Dashboard!**

Your MEIL dashboard is now live and ready to help optimize maintenance operations.
