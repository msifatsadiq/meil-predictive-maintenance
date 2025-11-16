# Screen Recording Script - MEIL Dashboard Technical Walkthrough

**Duration:** 2-3 minutes  
**Tool:** Loom (loom.com - free, no download required)  
**Format:** Screen + Webcam (optional)

---

## 🎬 Recording Setup

### Before You Start:
- [ ] Close unnecessary browser tabs
- [ ] Open VS Code with project
- [ ] Open terminal in project directory
- [ ] Have live demo open: https://demomeildashboard.netlify.app
- [ ] Test microphone (speak clearly, not too fast)
- [ ] Hide .env file (contains credentials)

### Loom Settings:
1. Go to loom.com/record
2. Choose: "Screen + Webcam" or "Screen Only"
3. Select: VS Code window (or full screen)
4. Click "Start Recording"
5. 3-2-1 countdown begins

---

## 📝 Script - Exact Words to Say

### INTRO (10 seconds)

**[Show VS Code with project open]**

> "Hi Obiora, I'm [Your Name]. This is a quick technical walkthrough of the MEIL dashboard codebase, covering folder structure, component separation, state management, and KPI calculations as requested."

---

## SECTION 1: Folder Structure (30 seconds)

**[Show src/ folder in VS Code Explorer]**

> "Let me start with the folder structure. In the `src` directory, you'll see clear separation of concerns:"

**[Click through folders slowly]**

> "The **firebase** folder has three files - config for initialization only, auth for authentication logic only, and firestore for database operations only. Each has a single responsibility.

> The **pages** folder contains six page components - Login, Dashboard, Machines, Machine Detail, Events, and Work Orders. Each is under 300 lines and delegates complex logic to utilities.

> The **layout** folder has three reusable components - Layout wrapper, Sidebar, and Navbar - used across all authenticated pages.

> The **store** folder uses Zustand for state management - authStore for authentication state, appStore for UI state like dark mode.

> And the **utils** folder contains pure business logic - kpiCalculations for MTBF and MTTR algorithms, and helpers for UI functions."

**[Show utils/kpiCalculations.js file briefly]**

> "No giant components doing everything - each file has clear purpose."

---

## SECTION 2: State Management (30 seconds)

**[Open src/store/authStore.js]**

> "For state management, I chose Zustand over Redux because it's simpler and perfect for this scale."

**[Scroll through authStore.js]**

> "The auth store handles user state, role, and loading status. The initialize method listens for auth changes and fetches the user's role from Firestore."

**[Open src/store/appStore.js]**

> "The app store manages UI state - dark mode and sidebar toggle. Both stores are shared across all components without prop drilling."

**[Open src/pages/Dashboard.jsx - show useAuthStore import]**

> "Any component can access auth state by importing useAuthStore. Clean, type-safe, and easy to test."

---

## SECTION 3: Reusable Components (25 seconds)

**[Open src/layout/Layout.jsx]**

> "The Layout component is a reusable wrapper that combines Sidebar and Navbar."

**[Show how Layout wraps pages in App.jsx]**

> "In App.jsx, every authenticated route is wrapped by Layout, giving consistent navigation across all pages."

**[Open src/components/ProtectedRoute.jsx]**

> "ProtectedRoute is another reusable component that secures all authenticated routes. It checks if the user is logged in and redirects to login if not."

**[Show ProtectedRoute wrapping routes in App.jsx]**

> "This pattern keeps security logic centralized and reusable."

---

## SECTION 4: KPI Calculations (60 seconds) - **MOST IMPORTANT**

**[Open src/utils/kpiCalculations.js]**

> "Now for the KPI calculations - this is where the analytics logic lives."

**[Scroll to calculateMTBF function]**

> "MTBF - Mean Time Between Failures - is calculated as total operating time minus total downtime, divided by number of failures."

**[Point to edge case handling]**

> "Edge cases: if there are no events, it returns the full operating time. If downtimeMinutes is missing, it's treated as zero."

**[Scroll to calculateMTTR function]**

> "MTTR - Mean Time To Repair - is total downtime minutes divided by number of failures, converted to hours and rounded to two decimals."

**[Point to edge case checks]**

> "Again, handles empty arrays and missing data gracefully."

**[Open src/firebase/firestore.js - scroll to addEvent function]**

> "Downtime duration is calculated automatically in the addEvent function. When an event is created, the system converts start and end times to Firestore timestamps, then calculates downtimeMinutes as the difference in milliseconds divided by 60,000."

**[Point to downtimeMinutes calculation line]**

> "This field is automatically stored with every event, so KPI calculations are based on accurate, pre-calculated durations."

**[Show how events update in Dashboard]**

> "On the Dashboard, when new events are added, the KPIs recalculate in real-time using these functions."

---

## SECTION 5: Filters, Search & Machine Status (35 seconds)

**[Open src/pages/Machines.jsx]**

> "For filters and search, the Machines page demonstrates the pattern."

**[Scroll to filteredMachines variable]**

> "The filteredMachines variable uses JavaScript filter to match search terms against machine name or asset code, and filter by status if selected."

**[Scroll to search input and filter dropdown in JSX]**

> "The search input and status filter are controlled components that update state onChange, triggering re-filtering."

**[Point to status field in edit modal]**

> "Regarding how events update machine status - they don't automatically. In real factories, status should be explicit. A machine can be 'Stopped' for planned maintenance, not just because of events."

**[Show status options: Running, Stopped, Faulted, Under Maintenance]**

> "Engineers and admins manually update status when the machine state changes. This gives better control than inferring status from events."

**[Switch to Dashboard.jsx - show machine status cards]**

> "The Dashboard displays current status in real-time for operational overview."

---

## CLOSING (10 seconds)

**[Show GitHub repo or file tree one more time]**

> "That covers the technical architecture - clean separation, reusable components, solid state management, and production-ready KPI calculations with edge case handling. Happy to discuss any part in detail. Thanks!"

**[End recording]**

---

## 🎬 Recording Tips

### Do:
- ✅ Speak at moderate pace (not rushed)
- ✅ Pause 1-2 seconds when switching files
- ✅ Use cursor to point at code you're discussing
- ✅ Show actual code, not just describe it
- ✅ Demonstrate edge case handling in KPI functions
- ✅ Keep total time under 3 minutes

### Don't:
- ❌ Apologize or say "um" frequently
- ❌ Show .env file with credentials
- ❌ Leave errors or warnings visible in console
- ❌ Click around aimlessly
- ❌ Read code line-by-line
- ❌ Go over 3 minutes (client wants concise)

---

## 📤 After Recording

### Upload to Loom:
1. Loom auto-uploads when you stop recording
2. Get shareable link
3. Set privacy: "Anyone with the link" (not public)

### Or YouTube (Unlisted):
1. Upload video
2. Set visibility: "Unlisted"
3. Copy share link

### Add to DELIVERY_PACKAGE.md:
Replace `[You'll record and add this]` with your actual video link.

---

## 🎯 Key Points to Emphasize

Client specifically wants to see:

1. ✅ **No giant components** → Show each file is < 300 lines
2. ✅ **Separation of concerns** → Show firebase/ folder split
3. ✅ **Reusable components** → Show Layout, ProtectedRoute usage
4. ✅ **State management** → Show Zustand stores
5. ✅ **KPI calculation logic** → Show MTBF, MTTR, downtimeMinutes code
6. ✅ **Edge case handling** → Point to if statements in KPI functions
7. ✅ **Filter/search implementation** → Show filteredMachines logic
8. ✅ **Machine status update** → Explain manual vs automatic

---

## Alternative: If You're Camera-Shy

### Option: Screen + Audio Only
- Just share screen, no webcam
- Loom allows this (uncheck webcam)
- Less personal but still effective

### Option: Text Annotations
- Use Loom's cursor emphasis feature
- Add text callouts during recording
- Highlight code sections as you talk

---

## Time Breakdown

| Section | Duration | Priority |
|---------|----------|----------|
| Intro | 10 sec | Low |
| Folder Structure | 30 sec | High |
| State Management | 30 sec | Medium |
| Reusable Components | 25 sec | Medium |
| **KPI Calculations** | **60 sec** | **CRITICAL** |
| Filters & Status | 35 sec | High |
| Closing | 10 sec | Low |
| **TOTAL** | **3:00** | - |

---

## Practice Run

Before recording for real:

1. **Do a dry run** (record locally, watch it back)
2. **Check audio levels** (not too loud/quiet)
3. **Test cursor visibility** (make it larger if needed)
4. **Rehearse transitions** (know which files to open in order)
5. **Time yourself** (aim for 2:45, gives buffer)

---

## Final Checklist

Before hitting "Start Recording":

- [ ] VS Code open with project
- [ ] Terminal in project directory (shows professional setup)
- [ ] All necessary files identified (know where to click)
- [ ] No sensitive data visible (.env hidden)
- [ ] Microphone tested
- [ ] Script reviewed (know what to say)
- [ ] 3-minute timer ready
- [ ] Confident and ready!

---

**You've got this! The code is solid, you just need to present it clearly. Good luck! 🎥**
