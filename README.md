# Habitribe

> Build better habits, one day at a time. A modern, cross-platform habit tracking app with timezone-aware scheduling and real-time synchronization.

<div align="center">

[![Expo](https://img.shields.io/badge/Expo-54.0.22-000020.svg?style=for-the-badge&logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61DAFB.svg?style=for-the-badge&logo=react)](https://reactnative.dev)
[![Convex](https://img.shields.io/badge/Convex-1.27.3-FF6B6B.svg?style=for-the-badge)](https://convex.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6.svg?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

**[Live Demo](#getting-started) • [Documentation](CLAUDE.md) • [Contributing](#contributing)**

</div>

---

## ✨ Features

<table>
<tr>
<td>

### 📅 Multi-Frequency Tracking
Track daily, weekly, and monthly habits with flexible scheduling patterns. Set specific days of the week or let habits repeat automatically.

### 🌍 Timezone-Aware
Smart entry creation works across all timezones. No more confusion about "which day is it" — the app uses your local date.

### ⚡ Real-Time Sync
Instant updates across devices via Convex's reactive backend. Changes appear immediately without manual refreshing.

### 📸 Proof Verification
Capture photos or videos as proof of habit completion. Camera integration lets you document your progress.

</td>
<td>

### 🔐 Secure Auth
Email-based OTP authentication with secure token storage. Your data stays private and secure.

### 🎨 Beautiful UI
Dark mode support with a modern, themeable design system. Built for readability and usability.

### ⏰ Smart Reminders
Customizable notifications keep you on track. Set reminders for your habits and never forget.

### 📊 Visual Analytics
GitHub-style contribution heatmaps show your habit streaks. Bar charts and donut charts visualize progress.

</td>
</tr>
</table>

---

## 🏗️ Architecture

### Smart Entry Creation

Habitribe solves the **timezone problem** that plagues most habit trackers with a dual-layer approach:

```
┌─────────────────────────────────────────────────┐
│ User Opens App (Local Timezone)                 │
└────────────┬────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────┐
│ Client-Driven Lazy Creation                     │
│ • Uses user's local date (YYYY-MM-DD)           │
│ • Creates entries immediately on app open       │
│ • Ensures habits appear right away              │
└────────────┬────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────┐
│ Cron Jobs (Backup Safety Net)                   │
│ • Runs at UTC 00:01 (daily, weekly, monthly)    │
│ • Idempotent: prevents duplicates               │
│ • Ensures consistency across timezones          │
└─────────────────────────────────────────────────┘
```

**Why this matters:** No more 3am timezone bugs. No more entries on the wrong day. The app respects your local time.

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React Native + Expo, Expo Router v6, Zustand, TypeScript |
| **Backend** | Convex (real-time DB + serverless), @convex-dev/auth |
| **Validation** | Zod (runtime schema validation) |
| **Code Quality** | Biome (linting + formatting) |
| **Media** | expo-camera, expo-media-library, expo-video |

---

## 🚀 Quick Start

### Prerequisites

```bash
Node.js 18+ • npm/pnpm • Expo CLI
iOS Simulator (Mac) or Android Emulator
```

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/habitribe.git
cd habitribe

# Install dependencies
npm install

# Start Convex backend (in terminal 1)
npx convex dev

# Start the app (in terminal 2)
npx expo start
```

### Running the App

- **iOS:** Press `i` in the Expo CLI
- **Android:** Press `a` in the Expo CLI
- **Web:** Press `w` in the Expo CLI
- **Physical Device:** Scan the QR code with Expo Go app

---

## 📱 Project Structure

```
habitribe/
├── app/                          # Expo Router (file-based routing)
│   ├── (auth)/                   # Authentication screens
│   │   └── sign-in.tsx           # OTP sign-in flow
│   ├── (tabs)/                   # Main tab navigation
│   │   ├── index.tsx             # Habits list (daily/weekly/monthly)
│   │   ├── camera.tsx            # Proof capture
│   │   └── settings.tsx          # User settings
│   └── habit/                    # Habit management modals
│       ├── form.tsx              # Create/edit form
│       ├── [id]/                 # Habit detail screens
│       └── ...                   # Icon, schedule, proof, goal modals
│
├── convex/                       # Backend (Convex serverless)
│   ├── schema.ts                 # Database schema
│   ├── cron.ts                   # Cron job config
│   ├── crons/entries.ts          # Entry creation logic
│   ├── auth.ts                   # Auth configuration
│   └── exec/                     # Mutations & queries
│       ├── create.ts             # addHabit, addEntry, etc.
│       ├── read.ts               # getUserHabits, getTodaysHabits, etc.
│       ├── update.ts             # updateHabit, updateEntry, etc.
│       └── delete.ts             # deleteHabit, deleteReminder, etc.
│
├── components/                   # Reusable React components
│   ├── habit/
│   │   ├── HabitCard.tsx         # Habit list item
│   │   ├── HabitChart.tsx        # Multi-variant chart container
│   │   ├── HabitHeatmap.tsx      # GitHub-style contribution grid
│   │   └── ...
│   └── ui/                       # Common UI components
│
├── stores/                       # Zustand state management
│   ├── habitFormStore.ts         # Form state with persistence
│   ├── habitSelectStore.ts       # Modal visibility state
│   └── habitChartStore.ts        # Chart date range state
│
├── utils/                        # Helper functions
│   ├── chartHelper.ts            # Chart data aggregation
│   ├── dateHelper.ts             # Date parsing & formatting
│   └── boundsHelper.ts           # Week/month calculations
│
├── hooks/                        # Custom React hooks
│   ├── useTheme.tsx              # Theme provider & hook
│   └── useFirstTimeOpen.tsx      # First-time user detection
│
├── validation/                   # Zod schemas
│   └── HabitSchema.ts            # Habit form validation
│
├── constants/                    # App constants
│   ├── colors.ts                 # Color schemes (light/dark)
│   ├── icons.ts                  # Icon mappings
│   └── emojis.ts                 # Emoji categories
│
└── assets/                       # Images, fonts, styles
    └── styles/guides/            # Design documentation
```

---

## 🔑 Core Features Deep Dive

### 1️⃣ Multi-Frequency Habits

**Daily Habits:**
- Every day: `pattern: 1`
- Specific weekdays: `pattern: [0, 2, 4]` (Sunday, Tuesday, Thursday)

**Weekly Habits:**
- Fixed Monday-Sunday cycles
- Entries created on Monday, persist through Sunday
- Perfect for "weekly review" or "team standup" habits

**Monthly Habits:**
- Fixed 1st-to-last-day cycles
- Entries created on the 1st, persist through month-end
- Great for "monthly planning" or "subscription reviews"

### 2️⃣ Timezone-Safe Entry Creation

```typescript
// Client sends local date
const today = new Date(); // User's local timezone
addMissingEntries({ date: formatLocalDate(today) });

// Backend creates entries based on that date, not UTC
// No more 3am timezone bugs!
```

Entry retrieval is period-aware:
- **Daily:** Exact date match
- **Weekly:** Range query (Monday-Sunday)
- **Monthly:** Range query (1st-last day)

### 3️⃣ Visual Analytics

Three chart variants in one component:

| Chart | Use Case | Data |
|-------|----------|------|
| **Heatmap** | Daily progress view | GitHub-style grid |
| **Bar Chart** | Weekly comparison | Stacked weekly totals |
| **Donut** | Monthly overview | Progress ratio per month |

All charts auto-align to week/month boundaries and fill missing data with zeros.

### 4️⃣ Cron Jobs (Safety Net)

Runs automatically at UTC 00:05:

```typescript
// Every day
crons.daily("create daily habit entries", ...)

// Every Monday
crons.weekly("create weekly habit entries", ...)

// 1st of every month
crons.monthly("create monthly habit entries", ...)
```

Idempotent checks prevent duplicates, even if cron runs multiple times.

---

## 🛠️ Development

### Scripts

```bash
npm start              # Start Expo development server
npm run android        # Run on Android emulator
npm run ios           # Run on iOS simulator
npm run web           # Run web version
npm run lint          # Lint with Biome (auto-fix)
npm run format        # Format with Biome
npm run check         # Lint + format together
```

### Testing Cron Jobs

```bash
# Run a cron function directly
npx convex run crons/entries:createDailyHabitEntries

# Test with a specific date
npx convex run crons/entries:createDailyHabitEntries '{"date": "2025-01-15"}'
```

Or use the [Convex Dashboard](https://dashboard.convex.dev):
1. Go to Functions → `crons/entries`
2. Click a function and use "Run Function"
3. Pass JSON args: `{ "date": "2025-01-15" }`

### Code Quality

- **TypeScript:** Strict mode enabled for type safety
- **Biome:** Opinionated linter + formatter (no config debates!)
- **Zod:** Runtime validation for all API data
- **Path Alias:** `@/*` maps to root for clean imports

---

## 📊 Database Schema

### Core Tables

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| **habits** | User habit definitions | name, icon, emoji, color, schedule, proof method |
| **habitEntries** | Daily/weekly/monthly progress | date, value, habitId, completed |
| **reminders** | User notifications | time, habitId, enabled |
| **proofMethods** | Verification methods | name (photo, video, count, etc.) |
| **users** | Auth user data | email, userId (from Convex auth) |

**Date Format:** All dates stored as `YYYY-MM-DD` strings (local timezone)

---

## 🎯 Roadmap

- [ ] **Streaks** - Track consecutive days/weeks of completed habits
- [ ] **Statistics** - Completion rates, trends, insights
- [ ] **Social** - Share habits, compete with friends, leaderboards
- [ ] **Widgets** - iOS/Android home screen widgets
- [ ] **Web Dashboard** - Desktop view with advanced analytics
- [ ] **Habit Templates** - Pre-built habits with popular schedules
- [ ] **Notifications** - Push notifications from cron jobs
- [ ] **Export Data** - CSV export for personal analytics

---

## 🤝 Contributing

We welcome contributions! Whether it's bug fixes, new features, or documentation improvements:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow the existing code style (Biome will auto-fix)
- Add tests for new features
- Update documentation if needed
- Keep commits atomic and descriptive

---

## 📚 Documentation

- **[CLAUDE.md](CLAUDE.md)** - Detailed technical guide for developers
- **[Architecture Guide](#architecture)** - How the app is structured
- **[Database Schema](#database-schema)** - Data model reference

---

## 📄 License

MIT License © 2025 - See [LICENSE](LICENSE) for details

---

## 🙌 Built With

- **[Expo](https://expo.dev)** - React Native development platform
- **[Convex](https://convex.dev)** - Real-time backend & database
- **[Zustand](https://github.com/pmndrs/zustand)** - State management
- **[Zod](https://zod.dev)** - TypeScript-first validation
- **[Lucide](https://lucide.dev)** - Icon library
- **[Biome](https://biomejs.dev)** - Code quality tools

---

## 📧 Connect

**Simeon Dunn** - [@_simeon_dunn](https://twitter.com/_simeon_dunn)

**GitHub:** [sime_time/habitribe](https://github.com/sime_time/habitribe)

---

<div align="center">

**[⬆ back to top](#habitribe)**

</div>
