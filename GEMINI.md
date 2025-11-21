# GEMINI.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Habitribe is a cross-platform (iOS, Android, Web) habit tracking application built with:
- **Expo** with React Native for mobile development
- **Convex** for backend/database with real-time sync
- **Expo Router** for file-based routing
- **TypeScript** with strict mode enabled
- **Zustand** for client-side state management with persistence
- **Biome** for linting and formatting
- **Zod** for runtime schema validation

## Development Commands

### Starting the App
```bash
npx expo start              # Start development server
npm start                   # Alternative start command
npm run android             # Start on Android emulator
npm run ios                 # Start on iOS simulator
npm run web                 # Start web version
```

### Convex Backend
```bash
npx convex dev              # Start Convex development server (required for backend)
```
**Note:** Run this in a separate terminal alongside `npm start`. Convex syncs database changes and provides real-time features.

### Code Quality
```bash
npm run lint                # Run Biome linter with auto-fix
npm run format              # Run Biome formatter with auto-fix
npm run check               # Run both linter and formatter with auto-fix
```

**Biome Configuration:**
- Generated files in `convex/_generated/` and `.expo/` are excluded from linting
- Double quotes enforced in JavaScript
- Import organization enabled

### Utilities
```bash
npm run reset-project       # Move starter code to app-example and create blank app directory
```

## Project Architecture

### Routing Structure
File-based routing with Expo Router (v6):
- `app/(auth)/` - Authentication flows (sign-in)
- `app/(tabs)/` - Main tab navigation (index, camera, settings)
- `app/habit/` - Habit creation/editing modal screens
- `app/calendar.tsx` - Full-screen calendar view for tracking habit entries and proofs
- `app/proof/` - Proof method selection and handling
- `app/_layout.tsx` - Root layout with auth routing logic and providers

### Tab Navigation
Three main tabs in `app/(tabs)/`:
- **index.tsx** - Habits list grouped by frequency (daily, weekly, monthly)
  - Calls `addMissingEntries` mutation on mount to ensure entries exist
  - Uses `useRef` to prevent duplicate mutation calls during re-renders
  - Displays habits with real-time entry data via reactive queries
- **camera.tsx** - Camera interface for habit proof capture (expo-camera)
- **settings.tsx** - User settings and preferences

**First-time User Experience:**
- Uses `useFirstTimeOpen` hook to detect first-time app launch
- Redirects to onboarding flow on first open
- Preference stored in AsyncStorage

### Calendar Screen
- `app/calendar.tsx` provides a full-screen calendar for viewing and interacting with habit entries.
- Displays habit entries for each day, allowing users to tap on a day to see details or add proofs.
- Integrates with `ProofCalendar` component from `components/calendar/ProofCalendar.tsx` for visual representation.
- Navigation allows users to move between months and years.

### Authentication Flow
Uses `@convex-dev/auth` with custom OTP (One-Time Password) email authentication:
- Configured in `convex/auth.config.ts` and `convex/auth.ts`
- Custom OTP resend logic in `convex/resendOTP.ts`
- Secure token storage via `expo-secure-store` on native platforms
- Auth state managed by `ConvexAuthProvider` in root layout
- Protected routes redirect unauthenticated users to sign-in

### State Management
**Zustand stores with AsyncStorage persistence:**
- `stores/habitFormStore.ts` - Manages habit creation/editing form state with draft persistence
- `stores/habitSelectStore.ts` - Controls habit sheet modal visibility
- `stores/habitChartStore.ts` - Manages chart display state (current time range, numDays, endDate)

**Key features:**
- Form state persists across app restarts (draft saving)
- Custom JSON serialization for Date objects in reminders
- Icon/emoji/color selection state synchronized with form data
- Chart state controls date range for heatmap and other visualizations

### Convex Backend (convex/)
**Database schema** (`schema.ts`):
- `habits` - User habits with schedule, goals, proof methods
- `habitEntries` - Daily progress tracking
- `reminders` - User-configured reminder times
- `proofMethods` - Available verification methods
- Auth tables from `@convex-dev/auth`

**Mutations/Queries** organized by CRUD operations:
- `exec/create.ts` - addHabit, addHabitEntry, addReminder, addMissingEntries
- `exec/read.ts` - getUserHabits, getTodaysHabits, getHabitEntry, getProofMethods, etc.
- `exec/update.ts` - updateHabit, updateHabitEntry, editReminder
- `exec/delete.ts` - deleteHabit, deleteReminder

**Cron Jobs System** (`cron.ts` and `crons/`):
Automated habit entry creation runs at midnight UTC:
- `crons.daily()` - Creates daily habit entries every day at 00:05 UTC
- `crons.weekly()` - Creates weekly habit entries every Monday at 00:05 UTC
- `crons.monthly()` - Creates monthly habit entries on 1st of month at 00:05 UTC
- Internal mutations in `crons/entries.ts` handle the actual entry creation logic

**Lazy Entry Creation Pattern**:
Primary entry creation happens **on-demand** when users open the app:
- Client calls `addMissingEntries` mutation with user's local date
- Solves timezone issues - client controls what "today" means in their timezone
- Entries created just-in-time, ensuring habits appear immediately
- Cron jobs serve as backup to ensure consistency
- Backend prevents duplicates via idempotent checks (only creates if entry doesn't exist)

### Theming System
Utility-based style guides in `assets/styles/guides/`:
- `STYLE_GUIDE.md`
- `COLOR_SYSTEM.md`
Custom theme system with dark mode support:
- `hooks/useTheme.tsx` - ThemeProvider and useTheme hook
- `constants/colors.ts` - Light and dark color schemes
- Theme preference persisted in AsyncStorage
- Colors accessed via `const { colors, isDarkMode } = useTheme()`

### Validation
**Zod schemas** `validation/`:
- `HabitSchema.ts` - Validates habit form data with schedule patterns
- `EmailSchema.ts` - Email validation for authentication

### Constants
- `constants/colors.ts` - Theme color definitions and icon colors
- `constants/icons.ts` - Lucide icon name mappings
- `constants/emojis.ts` - Categorized emoji sets for habit icons
- `constants/initialForm.ts` - Default habit form values
- `constants/proofMethodDefaults.ts` - Default goal targets/units per proof method
- `constants/sizes.ts` - UI sizing constants
- `constants/goalUnits.ts` - Available units for goal measurements

### Utilities
Helper functions in `utils/`:
- `boundsHelper.ts` - Date range utilities (renamed from dateHelper.ts for week/month calculations)
  - `getWeekBounds(date)` - Returns Monday-Sunday range for any date
  - `getMonthBounds(date)` - Returns first-last day of month for any date
  - `calculateStartDateFromNumDays(endDate, numDays)` - Calculate start date from range
  - `calculatePaddingForWeekAlignment(startDate)` - Get padding days to align to Monday
- `dateHelper.ts` - Date parsing and formatting utilities
  - `parseLocalDate(dateString)` - Parse YYYY-MM-DD as local time (not UTC)
  - `formatLocalDate(date)` - Format Date to YYYY-MM-DD string
  - `getTodayDateString()` - Get today's date as YYYY-MM-DD
- `chartHelper.ts` - Visualization and data aggregation helpers
  - `generateFullActivityRange(endDate, numDays, data)` - Fill date range with activity data (0 for missing dates)
  - `groupActivityIntoWeeks(activity)` - Convert flat activity array to 2D weeks array
  - `aggregateWeekValues(weeks)` - Sum activity values per week
  - `calculateIntensity(value, maxValue)` - Normalize value to 0-1 intensity
  - `getColorFromIntensity(intensity, accentColor, borderColor)` - Map intensity to color shade
  - `getMaxActivityValue(activity)` - Get max value from activity array
  - `generateMonthRange(start, end)` - Generate array of months in range
  - `shiftDate(date, numDays)` - Shift date forward/backward
- `habitFormLabels.ts` - Schedule label formatting utilities

### Components
Reusable UI components:
- `Emoji.tsx` - Displays emoji icons for habits
- `WeekDaySelector.tsx` - Multi-select for weekly schedules
- `CommitStatement.tsx` - Dynamic commitment text with different formats based on proof method
- `HabitSheet.tsx` - Bottom sheet for habit interactions
- `HabitChart.tsx` - Multi-variant chart component (daily heatmap, weekly bar, monthly donut)
- `HabitHeatmap.tsx` - GitHub-style contribution heatmap with horizontal scrolling

### Path Aliases
TypeScript paths configured: `@/*` maps to root directory

## Habit Creation/Edit Flow

The habit creation is managed through a main form with modal screens for specific inputs:

**Main Form** (`form.tsx`):
- Entry point for habit creation/editing
- Displays name input, icon selector, reminders toggle/configuration
- Shows `CommitStatement` component for commitment visualization
- Supports both create and edit modes (determined by `id` query parameter)
- Contains submit, update, and delete functionality

**Modal Screens** (accessed from CommitStatement or form):
- **icon.tsx** - Icon/emoji and color selection
- **description.tsx** - Habit description with dynamic placeholders based on proof method
- **schedule.tsx** - Frequency (daily/weekly/monthly) and pattern configuration
- **proof.tsx** - Proof method selection
- **goal.tsx** - Goal target and unit (currently not in use, default is "1 count")
- **time.tsx** - Time-based goal input (currently not in use)

State flows through `habitFormStore` with automatic draft saving and persistence.

### Proof Selection Screen
- `app/proof/select.tsx` is a modal screen for users to choose from available proof methods.
- It displays a list of `ProofCard` components from `components/ProofCard.tsx`, each representing a different proof method.
- Users can select a proof method, which updates the habit form state.

## Database Conventions

- Date format: "YYYY-MM-DD" (string)
- Time format: "HH:mm" (24-hour, string)
- Schedule frequencies: "daily" | "weekly" | "monthly"
- Schedule patterns: number (every N frequency) OR number[] (specific weekdays, 0=Sunday)
- All mutations require authenticated userId via `getAuthUserId(ctx)`

### Habit Entry Creation Logic

**Daily Habits:**
- `pattern = 1` or `number >= 2`: Entry created every day
- `pattern = [0, 2, 4]` (array): Entry created only on specified weekdays (0=Sunday, 1=Monday, etc.)
- Entry `date` field = actual date (e.g., "2025-01-15")

**Weekly Habits:**
- Weeks run Monday-Sunday (fixed, not customizable per habit)
- Entry created once per week on Monday
- Entry `date` field = Monday's date (e.g., "2025-01-13" for the week of Jan 13-19)
- Same entry persists throughout the entire week
- Mid-week habit creation: Entry created with current week's Monday date

**Monthly Habits:**
- Months run 1st to last day of month
- Entry created once per month on the 1st
- Entry `date` field = first day of month (e.g., "2025-01-01" for all of January)
- Same entry persists throughout the entire month
- Mid-month habit creation: Entry created with current month's 1st date

**Entry Retrieval:**
- `getTodaysHabits(date)` returns habits grouped by frequency
- Daily habits: Queries for entries where `date === args.date`
- Weekly habits: Queries for entries where `date` is between Monday-Sunday of args.date's week
- Monthly habits: Queries for entries where `date` is between 1st-last day of args.date's month
- Habits returned with `{ ...habit, entry: entry || null }` structure

## Media Integration

**Camera:**
- Uses `expo-camera` package for photo/video-based habit proof
- Camera tab provides camera view with flip camera functionality
- Supports both front and back camera

**Media Library:**
- Uses `expo-media-library` for saving captured media
- Integrates with camera for proof storage

**Video:**
- Uses `expo-video` for video playback and recording capabilities
- Supports video-based habit proof methods

**Proof Method Integration:**
- Camera proof method affects CommitStatement format: "I'll [send a photo] of [description] every [frequency]"

## Chart & Visualization System

### HabitChart Component
Multi-variant chart component that switches between three visualization types:

**Daily Variant (Heatmap):**
- GitHub-style contribution grid showing daily activity
- Each square represents one day, color intensity = activity level
- Horizontal scrolling with fixed weekday labels on left
- Uses `generateFullActivityRange()` to fill missing dates with 0 values
- All weeks aligned to Monday-Sunday grid using `groupActivityIntoWeeks()`

**Weekly Variant (Bar Chart):**
- Stacked weekly totals using `react-native-gifted-charts`
- Aggregates daily values per week via `aggregateWeekValues()`
- Shows comparative view across weeks

**Monthly Variant (Donut Charts):**
- One donut per month showing progress ratio
- Skips empty first months
- Centers month abbreviation in donut

### Date Range Calculation
Key functions for managing chart date ranges:
- **`generateFullActivityRange(endDate, numDays, data)`** - Creates complete date range from endDate back numDays
  - **Critical fix:** Uses `Math.floor()` instead of `Math.ceil()` to prevent off-by-one errors
  - Fills missing dates with 0 values
  - Returns activity data aligned to Monday start dates for consistent week grouping
- **`groupActivityIntoWeeks(activity)`** - Groups flat activity array into weeks (7 days each)
  - Requires first day to be Monday for proper alignment
  - Logs warning if alignment is incorrect
- Date range controlled via `habitChartStore` (numDays, endDate)

## Testing Notes

- Uses Expo's built-in React Native testing setup
- New Expo architecture enabled (`newArchEnabled: true`)
- React Compiler experiments enabled
- Typed routes enabled for type-safe navigation

### Testing Cron Jobs

**Manual Testing:**
```bash
# Test internal mutations directly via CLI
npx convex run crons/entries:createDailyHabitEntries
npx convex run crons/entries:createWeeklyHabitEntries
npx convex run crons/entries:createMonthlyHabitEntries

# Or with specific dates for testing
npx convex run crons/entries:createDailyHabitEntries '{"date": "2025-01-15"}'
```

**Via Convex Dashboard:**
- Navigate to Functions → `crons/entries`
- Click function name and use "Run Function" UI
- Pass date argument as JSON: `{ "date": "2025-01-15" }`

**Testing Lazy Entry Creation:**
- Create habits with different frequencies
- Close and reopen app
- Check Convex Dashboard → Data → habitEntries table
- Verify entries created with correct dates (today for daily, Monday for weekly, 1st for monthly)

**Timezone Testing:**
- Crons run at UTC 00:05 (7:05 PM EST)
- Lazy creation uses client's local date, solving timezone issues
- Test by creating habits and verifying they appear immediately, regardless of when cron runs
