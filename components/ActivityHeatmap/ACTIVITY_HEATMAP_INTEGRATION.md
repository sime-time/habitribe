# ActivityHeatmap Component Integration Guide

## ✅ Conversion Complete

The `ContributionGraph` component from `react-native-chart-kit` has been successfully converted to your project's conventions and is ready to use as **ActivityHeatmap**.

## 📦 What You Got

A production-ready GitHub-style activity heatmap visualization component with:
- ✅ Functional component with React hooks
- ✅ Full TypeScript support (strict mode)
- ✅ No external dependencies (removed lodash)
- ✅ Theme system integration
- ✅ Comprehensive documentation
- ✅ 7+ practical examples

## 🚀 Quick Start

### Import
```tsx
import ActivityHeatmap from "@/components/ActivityHeatmap";
```

### Basic Usage
```tsx
<ActivityHeatmap
  data={[
    { date: "2025-01-15", value: 5 },
    { date: "2025-01-16", value: 8 },
  ]}
  endDate={new Date()}
  numDays={365}
  width={350}
  height={150}
  tooltipDataAttrs={(value) => ({
    fill: value?.value === 0 ? "#e5e7eb" : "#10b981",
  })}
/>
```

## 📁 File Organization

```
components/
└── ActivityHeatmap/
    ├── ActivityHeatmap.tsx      (425 lines) - Main component
    ├── types.ts                 (90 lines)  - TypeScript interfaces
    ├── utils.ts                 (65 lines)  - Date & calculation utilities
    ├── constants.ts             (28 lines)  - Static constants
    ├── index.tsx                (12 lines)  - Barrel export
    ├── README.md                           - Full documentation
    ├── QUICK_START.md                      - Quick reference
    ├── USAGE_EXAMPLE.tsx                   - 7 runnable examples
    └── CONVERSION_SUMMARY.md               - Technical details
```

## 📚 Documentation

### For Quick Start
Start here: **`components/ActivityHeatmap/QUICK_START.md`**
- Copy-paste examples
- Common patterns
- Troubleshooting

### For Comprehensive Details
Full guide: **`components/ActivityHeatmap/README.md`**
- All props explained
- Styling examples
- Accessibility features
- Performance tips

### For Usage Patterns
Code examples: **`components/ActivityHeatmap/USAGE_EXAMPLE.tsx`**
- BasicHabitHeatmap
- IntensityGradientHeatmap
- InteractiveHeatmap
- VerticalLayoutHeatmap
- MultipleHabitsComparison
- CustomMonthLabelsHeatmap
- AccessibleHeatmap

### For Technical Deep Dive
Architecture: **`components/ActivityHeatmap/CONVERSION_SUMMARY.md`**
- Changes from original
- Dependency analysis
- Performance metrics
- Migration guide

## 🎨 Integration with Your Design System

### Using Theme Colors
```tsx
import useTheme from "@/hooks/useTheme";
import ActivityHeatmap from "@/components/ActivityHeatmap";

const { colors } = useTheme();

<ActivityHeatmap
  data={data}
  endDate={new Date()}
  numDays={365}
  width={350}
  height={150}
  tooltipDataAttrs={(value) => ({
    fill: value?.value === 0 ? colors.muted : colors.primary,
  })}
/>
```

### Using Utility Styles
```tsx
import { s } from "@/assets/styles/utility.styles";
import { createColorStyles } from "@/assets/styles/color.styles";

<View style={[s.p4, s.roundedLg, c.bgCard]}>
  <ActivityHeatmap
    data={data}
    // ...
  />
</View>
```

## 🔧 Common Use Cases

### 1. Habit Completion Tracker
```tsx
const habitData = [
  { date: "2025-01-15", value: 1 },  // Completed
  { date: "2025-01-16", value: 0 },  // Skipped
];

<ActivityHeatmap
  data={habitData}
  endDate={new Date()}
  numDays={365}
  width={350}
  height={150}
  tooltipDataAttrs={(value) => ({
    fill: value?.value === 0 ? "#e5e7eb" : "#10b981",
  })}
/>
```

### 2. Activity Intensity Map
```tsx
// Show different colors for different activity levels
<ActivityHeatmap
  data={habitData}
  endDate={new Date()}
  numDays={365}
  width={350}
  height={150}
  tooltipDataAttrs={(value) => {
    const colors = ["#fff", "#dbeafe", "#93c5fd", "#3b82f6", "#1e40af"];
    const index = Math.min((value?.value ?? 0) / 2, colors.length - 1);
    return { fill: colors[Math.floor(index)] };
  }}
/>
```

### 3. Multiple Habits Comparison
```tsx
[habit1, habit2, habit3].map((habit) => (
  <View key={habit.id} style={s.gap2}>
    <Text>{habit.name}</Text>
    <ActivityHeatmap
      data={habit.entries}
      endDate={new Date()}
      numDays={365}
      width={350}
      height={100}
      showMonthLabels={false}
      tooltipDataAttrs={(value) => ({
        fill: value?.value === 0 ? colors.muted : colors.primary,
      })}
    />
  </View>
))
```

## 📊 Data Format

### Required Fields
```tsx
interface HeatmapDataPoint {
  date: Date | string | number;  // "2025-01-15" or timestamp
  value: number;                  // The activity value
}
```

### Accepted Date Formats
```tsx
// ISO string
{ date: "2025-01-15", value: 5 }

// Timestamp (milliseconds since epoch)
{ date: 1705276800000, value: 5 }

// Date object
{ date: new Date("2025-01-15"), value: 5 }
```

### With Convex Data
```tsx
const entries = useQuery(api.habits.getHabitEntries, { habitId });

const heatmapData = entries?.map(entry => ({
  date: entry.date,  // Already in "YYYY-MM-DD" format from Convex
  value: entry.completed ? 1 : 0,
})) ?? [];
```

## 🎯 Props Reference

### Essential Props
| Prop | Type | Description |
|------|------|-------------|
| `data` | `HeatmapDataPoint[]` | Activity data points |
| `endDate` | `Date \| string \| number` | End date of range |
| `numDays` | `number` | Days to display (365 = year) |
| `width` | `number` | SVG width in pixels |
| `height` | `number` | SVG height in pixels |
| `tooltipDataAttrs` | `(value) => {...}` | Styling function |

### Common Optional Props
| Prop | Type | Default | Purpose |
|------|------|---------|---------|
| `onDayPress` | `(day) => void` | - | Handle day clicks |
| `titleForValue` | `(value) => string` | - | Tooltip text |
| `showMonthLabels` | `boolean` | true | Show months |
| `horizontal` | `boolean` | true | Layout direction |
| `squareSize` | `number` | 20 | Cell size in px |
| `gutterSize` | `number` | 1 | Space between cells |

See `components/ActivityHeatmap/README.md` for all props.

## 🧪 Testing

### Unit Tests
```tsx
import { shiftDate, mapValue } from "@/components/ActivityHeatmap";

test("shiftDate shifts 5 days forward", () => {
  const start = new Date("2025-01-01");
  const result = shiftDate(start, 5);
  expect(result.getDate()).toBe(6);
});
```

### Component Tests
```tsx
import ActivityHeatmap from "@/components/ActivityHeatmap";

test("renders with data", () => {
  const { container } = render(
    <ActivityHeatmap
      data={[{ date: "2025-01-15", value: 5 }]}
      endDate={new Date()}
      numDays={365}
      width={350}
      height={150}
      tooltipDataAttrs={() => ({ fill: "#000" })}
    />
  );
  expect(container).toBeTruthy();
});
```

## 🚨 Troubleshooting

### Data not showing?
- ✅ Check dates are in correct format
- ✅ Verify `endDate` is after your data dates
- ✅ Ensure `numDays` covers your date range

### Colors not right?
- ✅ Test `tooltipDataAttrs` with hardcoded color first
- ✅ Check color values are valid hex/rgb
- ✅ Verify theme colors are loaded

### Layout issues?
- ✅ Use appropriate `width`/`height` for container
- ✅ Set `horizontal={false}` for vertical layout
- ✅ Adjust `squareSize` and `gutterSize` for density

## 📋 Breaking Changes from Original

If migrating from original `ContributionGraph`:

1. **Import path** changes:
   ```tsx
   // Before
   import ContributionGraph from "react-native-chart-kit";

   // After
   import ActivityHeatmap from "@/components/ActivityHeatmap";
   ```

2. **Props renamed**:
   ```tsx
   // Before: values
   // After: data

   // Before: chartConfig.color()
   // After: tooltipDataAttrs() function
   ```

3. **Dependencies removed**:
   - No more `lodash` needed
   - No `AbstractChart` base class

See `CONVERSION_SUMMARY.md` for detailed migration guide.

## 📦 Dependencies

### Required (already in project)
- `react`: 19.1.0+
- `react-native`: 0.81.5+
- `react-native-svg`: 15.12.1

### No new dependencies added!
- ✅ Removed `lodash`
- ✅ Uses native JavaScript `Array.from()`

## 🎓 Learning Path

1. **Read**: `QUICK_START.md` (5 min)
2. **Try**: Copy basic example and run it
3. **Explore**: Check `USAGE_EXAMPLE.tsx` for your use case
4. **Reference**: Use `README.md` for all props
5. **Deep dive**: `CONVERSION_SUMMARY.md` if needed

## ❓ Questions?

- **Quick answers**: Check `QUICK_START.md`
- **How to use X**: Check `README.md` sections
- **Code examples**: See `USAGE_EXAMPLE.tsx`
- **Technical details**: Read `CONVERSION_SUMMARY.md`

## ✨ Key Features

- 📊 GitHub-style activity heatmap
- 🎨 Fully customizable colors and styling
- 📱 Horizontal and vertical layouts
- 📅 Month labels with custom formatting
- 🖱️ Click handler for day selection
- ♿ Accessible with title/tooltip support
- 🔧 Configurable cell size and spacing
- 🚀 Optimized performance with memoization
- 📦 Zero external dependencies (besides react-native-svg)
- 📝 Comprehensive TypeScript types

## 🎉 Ready to Use!

The component is production-ready. Start with:

```tsx
import ActivityHeatmap from "@/components/ActivityHeatmap";

// In your component:
<ActivityHeatmap
  data={yourHabitData}
  endDate={new Date()}
  numDays={365}
  width={350}
  height={150}
  tooltipDataAttrs={(value) => ({
    fill: value?.value === 0 ? "#e5e7eb" : "#10b981",
  })}
/>
```

Then customize with props from the README!

---

**Conversion Date**: November 10, 2025
**Component Status**: Production Ready ✅
**Documentation**: Complete ✅
**Examples**: 7+ provided ✅
