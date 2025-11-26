# Robust Streak System - Revised Implementation Strategy

## Executive Summary

This revision addresses issues in the original roadmap and incorporates clearer business rules around entry deletion, streak breaks, migration timing, and rebuild atomicity.

**Key Changes from Original:**
1. Prevent mid-streak entry deletion (soft delete or prevent entirely)
2. Strict date validation (no future dates)
3. Atomic streak rebuilds with transaction safety
4. Backdated proofs limited to same day only
5. Track which entry breaks a streak for debugging
6. Clear migration plan with initial rebuild on first app launch
7. Additional schema indexes for performance
8. Zero-progress entries break streaks (gaps are treated as incomplete)

---

## Core Business Rules (Locked In)

### Entry Completion Rules
- An entry is **complete** if: `progress >= target`
- An entry is **incomplete** if: `progress < target` (including 0)
- Incomplete entries **break streak chains**
- Proof method changes don't affect streaks (only completion status matters)

### Streak Continuation Rules
**Daily Habits:**
- Consecutive days only (or pattern-specific weekdays)
- If pattern is array (e.g., `[1,3,5]`), only those weekdays count for continuity
- A 0-progress entry on a non-pattern day does NOT break the streak
- A 0-progress entry on a pattern day DOES break the streak

**Weekly Habits:**
- Only one entry per week (Monday = week anchor)
- Week runs Monday-Sunday
- Entry must be complete (progress >= 1) to continue streak
- 0-progress entry breaks the streak

**Monthly Habits:**
- Only one entry per month (1st = month anchor)
- Entry must be complete to continue streak
- 0-progress entry breaks the streak

### Backdated Proof Rules
- **Same day only**: Proofs can only be added for today's entry
- Proofs for past dates are NOT allowed
- This prevents "catch-up" scenarios that complicate streak logic

### Date Validation Rules
- Dates must be YYYY-MM-DD format (format validation only on backend)
- **Timezone-aware validation happens on client** (client knows its local timezone)
- Backend only validates: "Can only add proofs for today's entry" (where today = client-provided date)
- This avoids UTC/local timezone conflicts where server "today" differs from client "today"

### Entry Deletion Rules
- **Delete prevention**: Don't allow deleting entries at all
- Users can only reset progress to 0 (soft delete)
- If they want to remove an entry, reset it to 0 progress (breaks streak)
- This keeps historical data and maintains audit trail

---

## Schema Changes

### 1. Update `streaks` table:

```typescript
streaks: defineTable({
  habitId: v.id("habits"),
  userId: v.id("users"),
  startDate: v.string(),          // YYYY-MM-DD
  endDate: v.string(),            // YYYY-MM-DD
  length: v.number(),
  active: v.boolean(),
  entryIds: v.array(v.id("habitEntries")),  // NEW: exact entries in this streak
  breakingEntryId: v.optional(v.id("habitEntries")),    // NEW: which entry broke this streak (null for active)
})
  .index("by_habit", ["habitId"])
  .index("by_habit_date", ["habitId", "startDate"])  // NEW: for date-range queries
  .index("by_user", ["userId"])
  .index("by_user_habit", ["userId", "habitId"])
  .index("by_active_habit", ["habitId", "active"])
```

### 2. Add to `habitEntries` table (for validation):

No schema changes needed, but queries should include:
- `date` (YYYY-MM-DD)
- `progress` (number)
- `habitId` (reference)

---

## Implementation Phase 1: Validation Function

### 1.1 Create `convex/utils/streakValidator.ts`

This file contains **only format validation**. Date continuity logic lives in `streakCalculator.ts` to work with in-memory entries (O(N) instead of O(N log N)).

```typescript
// streakValidator.ts

export interface DateValidation {
  isValid: boolean
  error?: string
}

/**
 * Validate YYYY-MM-DD format only
 * Does NOT check date bounds (timezone issues: server UTC vs client local)
 *
 * Timezone-aware validation (future/past checks) must happen on CLIENT
 * Backend only validates format and when enforcing "same day only" rules
 */
export function validateEntryDate(dateString: string): DateValidation {
  // 1. Regex check for YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return { isValid: false, error: `Invalid date format: ${dateString}` }
  }

  // 2. Parse and check validity (not 2025-02-30)
  const parsed = parseLocalDate(dateString)
  if (isNaN(parsed.getTime())) {
    return { isValid: false, error: `Invalid date value: ${dateString}` }
  }

  return { isValid: true }
}
```

### 1.2 Create `convex/utils/streakCalculator.ts`

Contains all streak calculation and continuity check logic. Works with in-memory entries for O(N) efficiency.

```typescript
// streakCalculator.ts

import { parseLocalDate } from "@/utils/dateHelper"
import type { Doc, Id } from "../_generated/dataModel"

export interface StreakData {
  startDate: string
  endDate: string
  length: number
  entryIds: Id<"habitEntries">[]
  breakingEntryId?: Id<"habitEntries">  // Only for broken streaks
}

interface ContinuityCheck {
  isContinuous: boolean
  reason?: string
}

/**
 * Calculate ALL streaks (active and historical) for a habit
 * Returns array of streaks in chronological order (oldest first)
 * Last streak is marked as active if it's not broken
 *
 * O(N) complexity: single pass through entries with in-memory continuity checks
 */
export function calculateAllStreaks(
  entries: Doc<"habitEntries">[],
  habit: Doc<"habits">
): StreakData[] {
  if (entries.length === 0) {
    return []
  }

  const target = Array.isArray(habit.schedule.pattern) ? 1 : habit.schedule.pattern
  const streaks: StreakData[] = []
  let currentStreak: Doc<"habitEntries">[] = []
  let previousBreakingEntry: Doc<"habitEntries"> | null = null

  // Walk through entries chronologically (already sorted from query)
  for (const entry of entries) {
    const isComplete = entry.progress >= target

    if (!isComplete) {
      // Current entry is incomplete
      if (currentStreak.length > 0) {
        // Save completed streak
        streaks.push(buildStreakData(currentStreak, previousBreakingEntry?._id))
        currentStreak = []
      }
      previousBreakingEntry = entry
    } else {
      // Current entry is complete
      if (currentStreak.length === 0) {
        // Start new streak
        currentStreak.push(entry)
      } else {
        // Check continuity with previous entry in streak (in-memory comparison)
        const previousEntry = currentStreak[currentStreak.length - 1]
        const isContinuous = checkContinuity(
          previousEntry.date,
          entry.date,
          habit.schedule.frequency,
          habit.schedule.pattern
        )

        if (isContinuous.isContinuous) {
          currentStreak.push(entry)
        } else {
          // Continuity broken
          streaks.push(buildStreakData(currentStreak, previousBreakingEntry?._id))
          currentStreak = [entry]
          previousBreakingEntry = null
        }
      }
    }
  }

  // Don't forget last streak
  if (currentStreak.length > 0) {
    streaks.push(buildStreakData(currentStreak, null))  // Last streak is never "broken"
  }

  return streaks
}

/**
 * Check if two consecutive entries maintain streak continuity
 * Private helper used by calculateAllStreaks
 */
function checkContinuity(
  previousDate: string,
  currentDate: string,
  frequency: "daily" | "weekly" | "monthly",
  pattern: number | number[]
): ContinuityCheck {
  switch (frequency) {
    case "daily":
      return checkDailyContinuity(previousDate, currentDate, pattern)
    case "weekly":
      return checkWeeklyContinuity(previousDate, currentDate)
    case "monthly":
      return checkMonthlyContinuity(previousDate, currentDate)
    default:
      return { isContinuous: false, reason: "Unknown frequency" }
  }
}

/**
 * Daily: Check if dates are N days apart or match weekday pattern
 */
function checkDailyContinuity(
  previousDate: string,
  currentDate: string,
  pattern: number | number[]
): ContinuityCheck {
  const previous = parseLocalDate(previousDate)
  const current = parseLocalDate(currentDate)

  const daysDiff = Math.floor((current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24))

  if (typeof pattern === "number") {
    // Every N days
    if (daysDiff !== pattern) {
      return {
        isContinuous: false,
        reason: `Expected ${pattern} day(s), got ${daysDiff}`
      }
    }
    return { isContinuous: true }
  } else {
    // Weekday pattern array [0=Sunday, 1=Monday, etc.]
    const previousWeekday = previous.getDay()
    const currentWeekday = current.getDay()

    // Both must be valid weekdays in pattern
    if (!pattern.includes(previousWeekday) || !pattern.includes(currentWeekday)) {
      return {
        isContinuous: false,
        reason: `Weekdays not in pattern`
      }
    }

    // Find expected gap between these two weekdays
    const expectedGap = getExpectedGapBetweenWeekdays(previousWeekday, currentWeekday, pattern)
    if (daysDiff !== expectedGap) {
      return {
        isContinuous: false,
        reason: `Expected ${expectedGap} days between pattern weekdays, got ${daysDiff}`
      }
    }

    return { isContinuous: true }
  }
}

/**
 * Weekly: Check if dates are exactly 7 days apart (both should be Mondays)
 */
function checkWeeklyContinuity(previousDate: string, currentDate: string): ContinuityCheck {
  const previous = parseLocalDate(previousDate)
  const current = parseLocalDate(currentDate)

  // Verify both are Mondays
  if (previous.getDay() !== 1 || current.getDay() !== 1) {
    return { isContinuous: false, reason: `Weekly entries must be on Mondays` }
  }

  const daysDiff = Math.floor((current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24))

  if (daysDiff !== 7) {
    return {
      isContinuous: false,
      reason: `Weekly entries must be 7 days apart, got ${daysDiff}`
    }
  }

  return { isContinuous: true }
}

/**
 * Monthly: Check if dates are in consecutive months (both on 1st of month)
 */
function checkMonthlyContinuity(previousDate: string, currentDate: string): ContinuityCheck {
  const previous = parseLocalDate(previousDate)
  const current = parseLocalDate(currentDate)

  // Both must be 1st of month
  if (previous.getDate() !== 1 || current.getDate() !== 1) {
    return { isContinuous: false, reason: `Monthly entries must be on 1st of month` }
  }

  // Check if exactly one month apart
  const previousMonth = previous.getMonth()
  const previousYear = previous.getFullYear()
  const currentMonth = current.getMonth()
  const currentYear = current.getFullYear()

  const isConsecutiveMonth =
    (currentYear === previousYear && currentMonth === previousMonth + 1) ||
    (currentYear === previousYear + 1 && previousMonth === 11 && currentMonth === 0)

  if (!isConsecutiveMonth) {
    return {
      isContinuous: false,
      reason: `Monthly entries not in consecutive months`
    }
  }

  return { isContinuous: true }
}

/**
 * Helper: Calculate days between two weekdays in a pattern
 * E.g., with pattern [1,3,5] (M/W/F), Monday to Wednesday = 2 days
 */
function getExpectedGapBetweenWeekdays(
  fromWeekday: number,
  toWeekday: number,
  pattern: number[]
): number {
  let gap = 0
  let current = fromWeekday

  while (current !== toWeekday) {
    current = (current + 1) % 7
    gap++

    if (gap > 7) {
      // Should have found it by now
      return -1
    }
  }

  return gap
}

/**
 * Helper: Convert entry array to StreakData
 */
function buildStreakData(
  entries: Doc<"habitEntries">[],
  breakingEntryId?: Id<"habitEntries">
): StreakData {
  return {
    startDate: entries[0].date,
    endDate: entries[entries.length - 1].date,
    length: entries.length,
    entryIds: entries.map((e) => e._id),
    ...(breakingEntryId && { breakingEntryId }),
  }
}
```

---

## Implementation Phase 2: Update Mutation Handlers

### 2.1 Modify `convex/utils/streakHelper.ts`

```typescript
// streakHelper.ts - COMPLETE REPLACEMENT

/**
 * Recalculate ALL streaks for a habit based on current entry data
 * - Fetches all entries for the habit
 * - Deletes all existing streaks for this habit
 * - Recalculates streaks from in-memory entry data (O(N))
 * - Inserts new streaks
 *
 * Called whenever any entry changes (add, update, reset)
 */
export const rebuildAllStreaks = internalMutation({
  args: { habitId: v.id("habits") },
  handler: async (ctx, args) => {
    const habit = await ctx.db.get(args.habitId)
    if (!habit) throw new ConvexError("Habit not found")

    // Fetch all entries for this habit (O(N) query with index)
    const entries = await ctx.db
      .query("habitEntries")
      .withIndex("by_habit_date", (q) => q.eq("habitId", args.habitId))
      .order("asc")
      .collect()

    // Calculate all streaks from in-memory entry data (O(N))
    const calculatedStreaks = calculateAllStreaks(entries, habit)

    // Delete all old streaks for this habit
    const oldStreaks = await ctx.db
      .query("streaks")
      .withIndex("by_habit", (q) => q.eq("habitId", args.habitId))
      .collect()

    for (const oldStreak of oldStreaks) {
      await ctx.db.delete(oldStreak._id)
    }

    // Insert recalculated streaks
    for (let i = 0; i < calculatedStreaks.length; i++) {
      const streak = calculatedStreaks[i]
      const isActive = i === calculatedStreaks.length - 1

      await ctx.db.insert("streaks", {
        habitId: args.habitId,
        userId: habit.userId,
        startDate: streak.startDate,
        endDate: streak.endDate,
        length: streak.length,
        active: isActive,
        entryIds: streak.entryIds,
        breakingEntryId: streak.breakingEntryId || null,
      })
    }

    return calculatedStreaks
  },
})
```

**Note on Atomicity:** Convex transactions would be ideal here, but if not available, the delete-then-insert approach is acceptable because:
1. Reads query the database (which may be temporarily empty)
2. On next mutation, rebuild runs again (idempotent)
3. No partial state is persisted to users for long

### 2.2 Modify `convex/exec/create.ts`

```typescript
// addMissingEntries() - change call site
// OLD:
// await ctx.runMutation(internal.utils.streakHelper.checkStreak, {...})

// NEW: After all entries created, rebuild once
await ctx.runMutation(internal.utils.streakHelper.rebuildAllStreaks, {
  habitId: habit._id
})

// ---

// addProof() - change call site
// OLD:
// if (newProgress === target) {
//   await ctx.runMutation(internal.utils.streakHelper.createOrIncrementStreak, {...})
// }

// NEW:
if (newProgress === target) {
  // Validate format only (timezone validation is client responsibility)
  const validation = validateEntryDate(entry.date)
  if (!validation.isValid) {
    throw new ConvexError(`Invalid entry date: ${validation.error}`)
  }

  // Client must pass clientTodayDate (client's local "today")
  // Server only enforces: proofs can only be for today
  if (entry.date !== args.clientTodayDate) {
    throw new ConvexError("Proofs can only be added for today's entry")
  }

  // Rebuild all streaks
  await ctx.runMutation(internal.utils.streakHelper.rebuildAllStreaks, {
    habitId: entry.habitId
  })
}
```

### 2.3 Modify `convex/exec/update.ts`

```typescript
// incrementHabitEntryProgress() - change call site
// OLD:
// if (newProgress >= target) {
//   await ctx.runMutation(internal.utils.streakHelper.createOrIncrementStreak, {...})
// }

// NEW:
if (newProgress >= target) {
  // Validate format only (timezone validation is client responsibility)
  const validation = validateEntryDate(entry.date)
  if (!validation.isValid) {
    throw new ConvexError(`Invalid entry date: ${validation.error}`)
  }

  // Client passes clientTodayDate; server enforces same-day only
  if (entry.date !== args.clientTodayDate) {
    throw new ConvexError("Can only increment today's entry")
  }

  await ctx.runMutation(
    internal.utils.streakHelper.rebuildAllStreaks,
    { habitId: entry.habitId }
  )
}

// ---

// resetHabitEntryProgress() - NEW logic
// Entry deletion is prevented; users reset progress to 0 instead
export const resetHabitEntryProgress = mutation({
  args: {
    id: v.id("habitEntries"),
    clientTodayDate: v.string(),  // Client's local "today" for comparison
  },
  handler: async (ctx, args) => {
    const entry = await ctx.db.get(args.id)
    if (!entry) throw new ConvexError("Entry not found")

    const habit = await ctx.db.get(entry.habitId)
    if (!habit) throw new ConvexError("Habit not found")

    // Prevent modifying future entries (client's local future, not server UTC)
    // Entry must be today or in the past (relative to client's timezone)
    if (entry.date > args.clientTodayDate) {
      throw new ConvexError("Cannot modify future entries")
    }

    // Reset progress to 0 (soft delete, keeps historical record)
    await ctx.db.patch(args.id, {
      progress: 0,
    })

    // Rebuild streaks (this entry no longer counts)
    await ctx.runMutation(
      internal.utils.streakHelper.rebuildAllStreaks,
      { habitId: entry.habitId }
    )
  },
})
```

### 2.4 Modify `convex/exec/delete.ts`

```typescript
// deleteProof() - change call site
// OLD: Manual streak decrement

// NEW: Prevent entry deletion entirely
export const deleteProof = mutation({
  args: {
    proofId: v.id("proofs"),
    habitEntryId: v.id("habitEntries"),
  },
  handler: async (ctx, args) => {
    const proof = await ctx.db.get(args.proofId)
    if (!proof) throw new ConvexError("Proof not found")

    const entry = await ctx.db.get(args.habitEntryId)
    if (!entry) throw new ConvexError("Entry not found")

    // Delete the proof
    await ctx.db.delete(args.proofId)

    // Decrement progress
    const newProgress = Math.max(0, entry.progress - 1)
    await ctx.db.patch(args.habitEntryId, {
      progress: newProgress,
    })

    // Rebuild streaks (entry may no longer be complete)
    await ctx.runMutation(
      internal.utils.streakHelper.rebuildAllStreaks,
      { habitId: entry.habitId }
    )
  },
})

// Prevention: Remove the deleteEntry/deleteProof mutation
// Users can only reset progress, not delete entries
```

---

## Implementation Phase 3: Migration & Initialization

### 3.1 Create Migration Hook

```typescript
// convex/migrations/migrateToRobustStreaks.ts

/**
 * Run on first app launch with new code
 * Clears old streaks and rebuilds from entries
 */
export const migrateToRobustStreaks = internalMutation({
  handler: async (ctx) => {
    // Delete ALL old streaks (clean slate)
    const allStreaks = await ctx.db.query("streaks").collect()
    for (const streak of allStreaks) {
      await ctx.db.delete(streak._id)
    }

    // Get all habits and rebuild their streaks
    const allHabits = await ctx.db.query("habits").collect()

    for (const habit of allHabits) {
      await ctx.runMutation(
        internal.utils.streakHelper.rebuildAllStreaks,
        { habitId: habit._id }
      )
    }

    return { habitsProcessed: allHabits.length }
  },
})
```

### 3.2 Trigger Migration on First App Launch

Add to `convex/exec/read.ts`:

```typescript
/**
 * Called on app launch
 * Checks if migration is needed and runs it once
 */
export const ensureMigratedStreaks = mutation({
  handler: async (ctx) => {
    // Check if any old-format streaks exist (without breakingEntryId field)
    const oldStreaks = await ctx.db.query("streaks").collect()

    const needsMigration = oldStreaks.some((s) => s.breakingEntryId === undefined)

    if (needsMigration) {
      const userId = await getAuthUserId(ctx)
      console.log(`Running streak migration for user ${userId}`)

      return await ctx.runMutation(
        internal.migrations.migrateToRobustStreaks
      )
    }

    return { migrated: false }
  },
})
```

Add to client app initialization (root layout or main hook):

```typescript
// Call on app launch (in useEffect with empty deps)
await client.mutation(api.exec.read.ensureMigratedStreaks).promise()
```

---

## Revised Testing Checklist

### Schema & Index Validation
- [ ] `habitEntries` queries use `by_habit_date` index
- [ ] Streaks table has all new fields: `entryIds`, `breakingEntryId`
- [ ] Streaks table has composite index `by_habit_date`

### Date Validation Tests (Backend - Format Only)
- [ ] Reject invalid YYYY-MM-DD format (e.g., "2025-1-15", "01-15-2025")
- [ ] Reject invalid dates (e.g., "2025-02-30", "2025-13-01")
- [ ] Accept valid YYYY-MM-DD dates (format only, bounds checked by client)

### Date Validation Tests (Client - Timezone-Aware)
- [ ] Client prevents submitting future dates
- [ ] Client prevents submitting dates > 30 days in past
- [ ] Client passes clientTodayDate with all mutations

### Continuity Tests (Daily)
- [ ] Pattern number: Rejects if not exactly N days apart
- [ ] Pattern array: Allows only pattern weekdays, rejects gaps between pattern days
- [ ] Pattern array: Ignores 0-progress on non-pattern days

### Continuity Tests (Weekly)
- [ ] Requires exactly 7 days
- [ ] Requires both dates are Mondays
- [ ] Rejects non-7-day gaps

### Continuity Tests (Monthly)
- [ ] Requires both on 1st of month
- [ ] Requires consecutive months
- [ ] Rejects same month

### Streak Calculation Tests
- [ ] Single completed entry = 1-day streak
- [ ] 3 completed consecutive entries = 3-day streak
- [ ] Gap (0-progress entry) breaks streak
- [ ] First incomplete entry stops streak calculation
- [ ] Historical streaks correctly identified
- [ ] Last streak marked as active
- [ ] No streaks if no completed entries

### Backdated Proof Tests (Same Day Only)
- [ ] Allow adding proof for today
- [ ] Reject adding proof for yesterday
- [ ] Reject adding proof for future dates

### Entry Reset Tests
- [ ] Reset entry progress to 0 breaks streak
- [ ] Reset allowed for today or past
- [ ] Reset prevented for future entries
- [ ] Historical streak data preserved after reset

### Entry Deletion Prevention
- [ ] Entry deletion mutation removed/blocked
- [ ] Users must reset progress instead

### Migration Tests
- [ ] Migration creates breakingEntryId field
- [ ] Migration recalculates all streaks
- [ ] Old streaks without field are detected
- [ ] Runs only once per user/device

### Atomicity Tests
- [ ] Rebuild with many streaks doesn't leave gaps
- [ ] If insert fails, old data still accessible on retry
- [ ] Multiple simultaneous mutations don't corrupt streaks

### Integration Tests
- [ ] Create daily habit → add 3 entries → streak is 3
- [ ] Reset middle entry → results in 2 separate streaks
- [ ] Add missing entry from past → extends streak backward (only today allowed, so N/A)
- [ ] Change proof method → streaks unaffected
- [ ] Weekly habit → entries on Monday only → 7-day gap checks work
- [ ] Monthly habit → entries on 1st only → month boundary checks work

---

## Key Implementation Order

1. **Schema update** - Add indexes and fields ✅ DONE
2. **streakValidator.ts** - Format validation only (simple) ✅ DONE (partial - fix typo in checkMonthlyContinuity error messages)
3. **streakCalculator.ts** - All streak calculation and continuity logic (O(N) in-memory)
4. **streakHelper.ts** - Replace with rebuildAllStreaks mutation
5. **Update create.ts** - Call rebuildAllStreaks after addMissingEntries
6. **Update update.ts** - Call rebuildAllStreaks on entry progress changes
7. **Update delete.ts** - Call rebuildAllStreaks when proof deleted
8. **Migration hook** - migrateToRobustStreaks to clean slate on first launch
9. **Client initialization** - Call ensureMigratedStreaks on app launch
10. **Testing** - Comprehensive test suite

---

## Risk Mitigation

### Risk: Performance with Many Entries
**Mitigation:** O(n) calculation is acceptable. Maximum typical entries per habit: 365 days/year * 5 years = ~1,825 entries. Rebuilding 1,825 entries takes milliseconds.

### Risk: Partial Rebuild Failure
**Mitigation:** Rebuilds are idempotent. If deletion succeeds but insertion fails, next mutation retries the entire rebuild.

### Risk: Date Format Inconsistencies
**Mitigation:** All date validation enforces YYYY-MM-DD, with error messages guiding users to correct format.

### Risk: Streak Corruption During Transition
**Mitigation:** Migration deletes all old streaks and rebuilds from entry data. No partial state exposed.

### Risk: Users Unable to Add Proofs for Past Dates
**Mitigation:** Business rule: proofs same-day only. This simplifies logic and prevents "catch-up" complexity.

---

## Success Criteria (Updated)

After implementation:
- [ ] All date formats validated strictly
- [ ] Streak calculation is deterministic (same input = same output)
- [ ] Backdated proofs only allowed for today
- [ ] Zero-progress entries break streaks correctly
- [ ] Entry deletion prevented (reset only)
- [ ] Migration clears old streaks on first launch
- [ ] Frequency-aware continuity checks work for daily/weekly/monthly
- [ ] Streak rebuilds are atomic (or idempotent fallback)
- [ ] All 40+ tests pass
- [ ] No "fragile streak" issues remain
