# Habitribe 🌟

A modern, cross-platform habit tracking application built with React Native and Convex. Track daily, weekly, and monthly habits with real-time synchronization and smart timezone handling.

[![Expo](https://img.shields.io/badge/Expo-51.0.0-000020.svg?style=flat&logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.74-61DAFB.svg?style=flat&logo=react)](https://reactnative.dev)
[![Convex](https://img.shields.io/badge/Convex-Backend-FF6B6B.svg?style=flat)](https://convex.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6.svg?style=flat&logo=typescript)](https://www.typescriptlang.org)

## ✨ Features

- 📅 **Multi-Frequency Habits** - Track daily, weekly, and monthly habits with flexible scheduling patterns
- 🌍 **Timezone-Aware** - Smart entry creation that works across all timezones
- ⚡ **Real-time Sync** - Instant updates across devices with Convex's reactive backend
- 🔐 **Secure Authentication** - Email-based OTP authentication with secure token storage
- 🎨 **Beautiful UI** - Dark mode support with a modern, themeable design system
- 📸 **Habit Proof** - Camera integration for photo/video-based habit verification
- ⏰ **Smart Reminders** - Customizable reminder system to keep you on track
- 🔄 **Offline-First** - Client-side state management with persistence

## 🏗️ Architecture Highlights

### Smart Entry Creation System

Habitribe uses a sophisticated **lazy creation pattern** combined with automated cron jobs:

- **Client-Driven**: Entries are created on-demand when users open the app, using their local timezone
- **Cron Backup**: Automated jobs run at midnight UTC to ensure consistency
- **Idempotent**: Duplicate prevention at the database level prevents race conditions
- **Period-Aware**: Weekly habits span Monday-Sunday, monthly habits span 1st-to-last day

### Tech Stack

**Frontend:**
- React Native + Expo for cross-platform development
- Expo Router v6 for file-based routing
- Zustand for state management with AsyncStorage persistence
- TypeScript with strict mode for type safety

**Backend:**
- Convex for real-time database and serverless functions
- Automated cron jobs for scheduled tasks
- @convex-dev/auth for authentication
- Zod for runtime schema validation

**Media & Camera:**
- expo-camera for photo/video capture
- expo-media-library for media storage
- expo-video for video playback

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/habitribe.git
   cd habitribe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Convex**
   ```bash
   npx convex dev
   ```
   This will create a new Convex project and link it to your local development.

4. **Start the app**
   ```bash
   npx expo start
   ```

5. **Run on your platform**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app for physical device

## 📱 App Structure

```
habitribe/
├── app/                      # Expo Router screens
│   ├── (auth)/              # Authentication flows
│   ├── (tabs)/              # Main tab navigation
│   │   ├── index.tsx        # Habits list (daily/weekly/monthly)
│   │   ├── camera.tsx       # Camera for habit proof
│   │   └── settings.tsx     # User settings
│   └── habit/               # Habit creation/edit modals
├── convex/                   # Convex backend
│   ├── schema.ts            # Database schema
│   ├── cron.ts              # Cron job configuration
│   ├── crons/               # Scheduled functions
│   │   └── entries.ts       # Entry creation logic
│   └── exec/                # Mutations and queries
│       ├── create.ts        # Create operations
│       ├── read.ts          # Read operations
│       ├── update.ts        # Update operations
│       └── delete.ts        # Delete operations
├── components/              # Reusable UI components
├── stores/                  # Zustand state stores
├── utils/                   # Helper functions
└── validation/              # Zod schemas
```

## 🔑 Key Technical Features

### 1. Timezone-Safe Habit Tracking

The app solves the common timezone problem in habit trackers:

- Client sends local date (`YYYY-MM-DD`) to backend
- Entries created based on user's "today", not server's UTC time
- Cron jobs serve as backup, not primary creation mechanism

### 2. Efficient Entry Retrieval

- Daily habits: Exact date match
- Weekly habits: Range query across Monday-Sunday
- Monthly habits: Range query across 1st-to-last day
- O(1) lookups using Map data structures

### 3. Smart Scheduling Patterns

**Daily Habits:**
- Every day (`pattern: 1`)
- Specific weekdays (`pattern: [0, 2, 4]` = Sunday, Tuesday, Thursday)

**Weekly Habits:**
- Fixed Monday-Sunday cycles
- Entry created on Monday, persists all week

**Monthly Habits:**
- Fixed 1st-to-last day cycles
- Entry created on 1st, persists all month

### 4. Automated Cron Jobs

```typescript
// Runs daily at 00:05 UTC
crons.daily("create daily habit entries", ...)

// Runs every Monday at 00:05 UTC
crons.weekly("create weekly habit entries", ...)

// Runs on 1st of month at 00:05 UTC
crons.monthly("create monthly habit entries", ...)
```

## 🧪 Development

### Code Quality

```bash
npm run lint      # Run Biome linter
npm run format    # Run Biome formatter
npm run check     # Run both linter and formatter
```

### Testing Cron Jobs

```bash
# Test internal mutations directly
npx convex run crons/entries:createDailyHabitEntries

# Test with specific date
npx convex run crons/entries:createDailyHabitEntries '{"date": "2025-01-15"}'
```

Or use the Convex Dashboard:
1. Navigate to Functions → `crons/entries`
2. Click function name
3. Use "Run Function" UI with JSON args

## 📊 Database Schema

### Core Tables

**habits**
- User habits with schedule configuration
- Proof method and goal tracking
- Icon, color, and description

**habitEntries**
- Daily progress tracking
- Date-based entry system (YYYY-MM-DD)
- Progress counter and completion status

**reminders**
- User-configured reminder times
- Linked to specific habits

**proofMethods**
- Available verification methods (photo, video, etc.)
- Defines how users prove habit completion

## 🎯 Roadmap

- [ ] Streak tracking and statistics
- [ ] Social features (share progress, compete with friends)
- [ ] Custom proof method uploads
- [ ] Advanced analytics and insights
- [ ] Widget support for iOS/Android
- [ ] Web dashboard
- [ ] Habit templates and recommendations

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev)
- Backend powered by [Convex](https://convex.dev)
- Icons from [Lucide](https://lucide.dev)
- UI inspiration from modern habit tracking apps

## 📧 Contact

Simeon Dunn - [@_simeon_dunn](https://twitter.com/_simeon_dunn)

Project Link: [https://github.com/sime_time/habitribe](https://github.com/sime_time/habitribe)

---

**Note:** This is an active development project. Features and documentation are continuously being improved.
