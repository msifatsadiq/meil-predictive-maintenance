# GitHub Repository Setup - Commit Strategy

## 🎯 Goal: Show Proper Development Workflow (Not Single Giant Commit)

---

## Quick Setup Commands

```bash
# 1. Initialize Git (if not already done)
cd /Users/sifatsadiq/Documents/Personal/Projects/MVP/predictive-maintenance-dashboard
git init

# 2. Create GitHub repo
# Go to github.com → New Repository → "meil-predictive-maintenance"
# Do NOT initialize with README (we have our own)

# 3. Add remote
git remote add origin https://github.com/YOUR_USERNAME/meil-predictive-maintenance.git

# 4. Create .gitignore (if not exists)
cat > .gitignore << EOL
node_modules/
dist/
.env
.DS_Store
*.log
.firebase/
EOL
```

---

## Commit Strategy - 10 Meaningful Commits

### Commit 1: Project Initialization
```bash
git add package.json package-lock.json vite.config.js eslint.config.js index.html
git add tailwind.config.js postcss.config.js
git add .gitignore README.md
git commit -m "chore: initialize Vite + React project with Tailwind CSS v4

- Setup Vite build configuration
- Add Tailwind CSS with PostCSS plugin
- Configure ESLint
- Add project README"
```

### Commit 2: Firebase Configuration
```bash
git add src/firebase/config.js .env.example firebase.json
git commit -m "feat: configure Firebase SDK

- Setup Firebase initialization
- Add environment variable support
- Include hosting configuration
- Add .env.example template"
```

### Commit 3: Authentication System
```bash
git add src/firebase/auth.js src/store/authStore.js
git add src/components/ProtectedRoute.jsx
git add src/pages/Login.jsx
git commit -m "feat: implement role-based authentication

- Create auth helper functions (signIn, signOut)
- Setup Zustand auth store with persistence
- Add ProtectedRoute component
- Build Login page with form validation"
```

### Commit 4: Layout & Navigation
```bash
git add src/layout/Layout.jsx src/layout/Sidebar.jsx src/layout/Navbar.jsx
git add src/store/appStore.js
git add src/index.css src/App.css
git commit -m "feat: build responsive layout components

- Create Layout wrapper with sidebar + navbar
- Add Zustand store for UI state (dark mode, sidebar toggle)
- Implement mobile-responsive navigation
- Setup global styles with Tailwind utilities"
```

### Commit 5: Routing Setup
```bash
git add src/App.jsx src/main.jsx
git commit -m "feat: configure React Router with protected routes

- Setup BrowserRouter with 6 routes
- Integrate ProtectedRoute for authenticated pages
- Add auth initialization on app mount
- Configure route guards by role"
```

### Commit 6: Dashboard & KPI Calculations
```bash
git add src/pages/Dashboard.jsx src/utils/kpiCalculations.js
git commit -m "feat: build analytics dashboard with KPI calculations

- Implement Dashboard page with 5 KPI cards
- Create MTBF calculation algorithm
- Create MTTR calculation algorithm
- Add downtime aggregation functions
- Integrate Recharts for bar chart and pie chart
- Show real-time machine status overview"
```

### Commit 7: Machines Management
```bash
git add src/firebase/firestore.js
git add src/pages/Machines.jsx src/pages/MachineDetail.jsx
git commit -m "feat: implement machines CRUD with detail view

- Create Firestore helper functions (add, update, delete, fetch)
- Build Machines list page with search and filters
- Add modal forms for create/edit operations
- Implement MachineDetail page with machine-specific KPIs
- Add role-based action permissions"
```

### Commit 8: Events Tracking
```bash
git add src/pages/Events.jsx
git commit -m "feat: add downtime events tracking system

- Build Events CRUD page
- Implement automatic downtimeMinutes calculation
- Add filters by machine and category
- Create timeline view for events
- Handle timestamp conversions for datetime inputs"
```

### Commit 9: Work Orders Management
```bash
git add src/pages/WorkOrders.jsx
git commit -m "feat: create work orders management system

- Build WorkOrders CRUD page
- Add priority and status filters
- Implement color-coded badges
- Add due date tracking with Firebase Timestamps
- Link work orders to machines"
```

### Commit 10: Security, Data Seeding, Documentation
```bash
git add firestore.rules scripts/seedData.js
git add SETUP.md DEPLOYMENT.md IMPLEMENTATION_COMPLETE.md
git add UPWORK_PROPOSAL.md DELIVERY_PACKAGE.md
git commit -m "feat: add security rules, data seeding, and documentation

- Implement Firestore security rules with role-based access
- Create data seeding script (8 machines, 30 events, 10 work orders)
- Add comprehensive setup guide
- Add deployment documentation
- Include technical delivery package
- Add Upwork proposal template"
```

---

## Push to GitHub

```bash
# Push all commits
git branch -M main
git push -u origin main
```

---

## Alternative: If Code Already Exists in Single State

If you've already written all the code and need to create commit history:

### Option A: Stash & Commit Incrementally (Recommended)

```bash
# 1. Stash everything
git add .
git stash

# 2. Commit incrementally (cherry-pick files)
# Follow the 10-commit strategy above, adding only relevant files each time

# Example for Commit 1:
git stash show -p | git apply --index -- package.json vite.config.js
git commit -m "chore: initialize Vite + React project..."

# 3. Continue for each commit group
# (This requires manual file selection, takes ~15 minutes)
```

### Option B: Interactive Rebase (Advanced)

```bash
# If you already have commits but want to reorganize:
git rebase -i HEAD~10

# Change "pick" to "reword" to edit commit messages
# Change order of commits if needed
# Save and push
```

### Option C: Fresh Start with Branches (Clearest History)

```bash
# 1. Create new repo
git init
git checkout -b develop

# 2. Commit in stages (copy files incrementally from backup)
# Follow 10-commit strategy

# 3. Merge to main
git checkout -b main
git merge develop
git push -u origin main
```

---

## Best Practice Tips

### Commit Message Format

```
<type>: <subject>

<optional body>

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes (formatting)
- refactor: Code restructuring
- test: Adding tests
- chore: Build/config changes
```

### What Makes a Good Commit

✅ **Single Purpose:** Each commit does ONE thing
✅ **Working Code:** Code compiles at every commit
✅ **Clear Message:** Explains WHAT and WHY (not HOW)
✅ **Logical Order:** Commits follow natural development flow
✅ **Right Size:** 50-200 lines changed per commit (not 5000)

❌ **Avoid:**
- "Fixed stuff"
- "WIP"
- "asdfasdf"
- Single commit with 100 files

---

## Quick Verification

After pushing, check your GitHub repo:

- [ ] See 10+ commits (not 1 giant commit)
- [ ] Each commit has clear message
- [ ] Commit messages explain feature added
- [ ] File changes per commit are logical
- [ ] History shows development progression
- [ ] .env file NOT in repo (only .env.example)
- [ ] node_modules NOT in repo

---

## Sample GitHub Repository Structure

```
meil-predictive-maintenance/
├── .gitignore
├── README.md
├── SETUP.md
├── DEPLOYMENT.md
├── DELIVERY_PACKAGE.md
├── package.json
├── vite.config.js
├── tailwind.config.js
├── index.html
├── firebase.json
├── firestore.rules
├── .env.example
├── public/
├── scripts/
│   └── seedData.js
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── index.css
    ├── components/
    ├── firebase/
    ├── layout/
    ├── pages/
    ├── store/
    └── utils/
```

---

## Time Estimate

- **Option A (Fresh commits):** 15-20 minutes
- **Option B (Rebase existing):** 10 minutes
- **Option C (Branch strategy):** 25-30 minutes

**Recommendation:** Option A if you care about clean history for client review.

---

## After GitHub Push

1. **Set Repository to Public** (or give Obiora access)
2. **Add Topics:** `react`, `firebase`, `predictive-maintenance`, `dashboard`
3. **Add Description:** "Predictive Maintenance Dashboard for MEIL - Role-based analytics with MTBF/MTTR calculations"
4. **Update DELIVERY_PACKAGE.md** with your actual GitHub URL
5. **Test clone:** `git clone YOUR_REPO_URL` in different directory to verify

---

You're ready to create a professional repository that demonstrates your development process! 🚀
