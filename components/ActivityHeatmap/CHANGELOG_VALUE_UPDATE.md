# ActivityHeatmap Component - Value Property Update

**Date**: November 10, 2025
**Status**: ✅ Complete
**Breaking**: Yes

## Overview

The ActivityHeatmap component has been updated to use `value` instead of `count` as the primary data property name, aligning with your Convex backend conventions.

## What Changed

### Data Structure
```tsx
// Before
{ date: "2025-01-15", count: 5 }

// After
{ date: "2025-01-15", value: 5 }
```

### Default Accessor
```tsx
// Before
accessor="count"

// After
accessor="value"  // Now default
```

### Code References
```tsx
// Before
value?.count === 0
value.count > 0
${value.count} completions

// After
value?.value === 0
value.value > 0
${value.value} completions
```

## Files Updated

### Core Component Files
- ✅ **ActivityHeatmap.tsx**: Default accessor + examples + empty datapoint creation
- ✅ **types.ts**: HeatmapDataPoint interface updated, JSDoc comments updated
- ✅ **constants.ts**: No changes (no count references)
- ✅ **index.tsx**: No changes (barrel export unaffected)
- ✅ **utils.ts**: No changes (utility functions unaffected)

### Documentation Files
- ✅ **README.md**: 10+ examples updated throughout
- ✅ **QUICK_START.md**: All examples and patterns updated
- ✅ **USAGE_EXAMPLE.tsx**: All 7 example components updated (40+ code references)
- ✅ **CONVERSION_SUMMARY.md**: Migration guide updated
- ✅ **VERIFICATION_CHECKLIST.md**: All test cases updated
- ✅ **ACTIVITY_HEATMAP_INTEGRATION.md**: Integration guide updated

## Migration Guide

If you're already using the component with the old `count` property:

### Step 1: Update Data Structure
```tsx
// Old
const data = [
  { date: "2025-01-15", count: 5 },
  { date: "2025-01-16", count: 8 },
];

// New
const data = [
  { date: "2025-01-15", value: 5 },
  { date: "2025-01-16", value: 8 },
];
```

### Step 2: Update tooltipDataAttrs Callback
```tsx
// Old
tooltipDataAttrs={(value) => ({
  fill: value?.count === 0 ? "#e5e7eb" : "#10b981",
})}

// New
tooltipDataAttrs={(value) => ({
  fill: value?.value === 0 ? "#e5e7eb" : "#10b981",
})}
```

### Step 3: Update titleForValue (if used)
```tsx
// Old
titleForValue={(value) => {
  if (!value) return "No activity";
  return `${value.date}: ${value.count} times`;
}}

// New
titleForValue={(value) => {
  if (!value) return "No activity";
  return `${value.date}: ${value.value} times`;
}}
```

### Step 4: Update Convex Integration (if applicable)
```tsx
// Old
const data = entries?.map(e => ({
  date: e.date,
  count: e.completed ? 1 : 0,
})) ?? [];

// New
const data = entries?.map(e => ({
  date: e.date,
  value: e.completed ? 1 : 0,
})) ?? [];
```

## Backward Compatibility

**None.** This is a breaking change. The `count` property is no longer supported.

If you need to use custom property names, use the `accessor` prop:
```tsx
<ActivityHeatmap
  data={data}
  accessor="completions"  // Use 'completions' instead of 'value'
  // ...
/>
```

## Rationale

1. **Consistency with Convex**: Your backend uses `value` as the property name
2. **Semantic clarity**: `value` is more generic and clearer than `count`
3. **No naming conflicts**: Avoids confusion with local `count` variables in render functions

## Verification Checklist

- ✅ Type definitions updated
- ✅ Default accessor changed to "value"
- ✅ All code examples use new property name
- ✅ All documentation updated
- ✅ All 7 usage examples updated
- ✅ Convex integration examples updated
- ✅ Test cases updated
- ✅ 50+ code references updated
- ✅ Zero references to old "count" property (except this changelog)

## Quick Start

```tsx
import ActivityHeatmap from "@/components/ActivityHeatmap";

const data = [
  { date: "2025-01-15", value: 5 },
  { date: "2025-01-16", value: 8 },
];

<ActivityHeatmap
  data={data}
  endDate={new Date()}
  numDays={365}
  width={350}
  height={150}
  tooltipDataAttrs={(value) => ({
    fill: value?.value === 0 ? "#e5e7eb" : "#10b981",
  })}
/>
```

## Questions?

Refer to the updated documentation:
- **QUICK_START.md** - Fast examples and patterns
- **README.md** - Comprehensive guide
- **USAGE_EXAMPLE.tsx** - 7 runnable examples

## Summary

All ActivityHeatmap files have been updated to consistently use `value` instead of `count`. This is a breaking change but aligns the component with your Convex backend conventions and provides better semantic clarity.

**Status**: ✅ Ready for production use
