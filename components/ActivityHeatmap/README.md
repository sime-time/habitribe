# ActivityHeatmap Component

A GitHub-style activity heatmap visualization component for React Native. Displays activity data as a grid of colored squares representing different activity levels over time.

## Features

- 📊 GitHub-style heatmap grid visualization
- 🎨 Fully customizable colors and opacity
- 📱 Support for horizontal and vertical layouts
- 📅 Month labels and date range support
- 🔲 Configurable cell size and spacing
- 📍 Click handler for day selection
- ♿ Accessible with title/tooltip support
- 🔧 TypeScript support with strict typing

## Installation

The component is already integrated into your project. Import it from:

```tsx
import ActivityHeatmap from "@/components/ActivityHeatmap";
```

## Basic Usage

```tsx
import ActivityHeatmap from "@/components/ActivityHeatmap";

const activityData = [
  { date: "2025-01-15", value: 5 },
  { date: "2025-01-16", value: 8 },
  { date: "2025-01-17", value: 0 },
  { date: "2025-01-18", value: 12 },
];

export default function HabitHistory() {
  return (
    <ActivityHeatmap
      data={activityData}
      endDate={new Date()}
      numDays={365}
      width={350}
      height={150}
      tooltipDataAttrs={(value) => ({
        fill: value && value.value > 0 ? "#10b981" : "#e5e7eb",
      })}
    />
  );
}
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `data` | `HeatmapDataPoint[]` | Array of activity data points with `date` and `value` properties |
| `endDate` | `Date \| string \| number` | End date for the heatmap range |
| `numDays` | `number` | Number of days to display (e.g., 365 for a year) |
| `width` | `number` | Width of the SVG container in pixels |
| `height` | `number` | Height of the SVG container in pixels |
| `tooltipDataAttrs` | `(value) => Partial<RectProps>` | Function to generate SVG attributes (fill, opacity, etc.) for each cell |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `gutterSize` | `number` | `1` | Spacing between cells in pixels |
| `squareSize` | `number` | `20` | Size of each cell in pixels |
| `horizontal` | `boolean` | `true` | If true, render weeks as columns; if false, render as rows |
| `showMonthLabels` | `boolean` | `true` | Show month labels on the heatmap |
| `showOutOfRangeDays` | `boolean` | `false` | Show empty days outside the data range |
| `accessor` | `string` | `"value"` | Property name to use as the activity value |
| `getMonthLabel` | `(monthIndex) => string` | - | Custom function to format month labels |
| `onDayPress` | `(dataPoint) => void` | - | Callback when a cell is pressed |
| `titleForValue` | `(value) => string` | - | Function to generate tooltip titles |
| `style` | `Partial<ViewStyle>` | `{}` | Additional View styles |
| `colorConfig` | `{ color: (opacity) => string }` | - | Custom color configuration |

## Data Format

Data points should follow this structure:

```tsx
interface HeatmapDataPoint {
  date: Date | string | number;  // ISO string, timestamp, or Date object
  value: number;                   // The activity value
  [key: string]: unknown;          // Additional properties
}
```

### Supported Date Formats

- **ISO String**: `"2025-01-15"`
- **Timestamp**: `1705276800000`
- **Date Object**: `new Date("2025-01-15")`

## Styling Examples

### Basic Color Mapping

```tsx
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

### Opacity-Based Intensity

```tsx
<ActivityHeatmap
  data={data}
  endDate={new Date()}
  numDays={365}
  width={350}
  height={150}
  tooltipDataAttrs={(value) => {
    const count = value?.value ?? 0;
    const opacity = Math.min(count / 10, 1); // normalize 0-10 to 0-1

    return {
      fill: "#3b82f6", // blue color
      fillOpacity: opacity,
    };
  }}
/>
```

### With Month Labels and Tooltips

```tsx
<ActivityHeatmap
  data={data}
  endDate={new Date()}
  numDays={365}
  width={350}
  height={150}
  showMonthLabels={true}
  getMonthLabel={(monthIndex) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[monthIndex];
  }}
  tooltipDataAttrs={(value) => ({
    fill: value?.value === 0 ? "#e5e7eb" : "#10b981",
  })}
  titleForValue={(value) => {
    if (!value) return "No activity";
    const date = new Date(value.date);
    return `${date.toLocaleDateString()}: ${value.value} completions`;
  }}
/>
```

### Custom Colors with Gradient

```tsx
<ActivityHeatmap
  data={data}
  endDate={new Date()}
  numDays={365}
  width={350}
  height={150}
  tooltipDataAttrs={(value) => {
    const count = value?.value ?? 0;

    // Color gradient: white -> light blue -> blue -> dark blue
    const colors = [
      "#ffffff", // 0
      "#dbeafe", // 1-2
      "#93c5fd", // 3-4
      "#3b82f6", // 5-6
      "#1e40af", // 7+
    ];

    const colorIndex = Math.min(Math.floor(count / 2), colors.length - 1);

    return {
      fill: colors[colorIndex],
    };
  }}
/>
```

## Integration with Convex Data

```tsx
import { useQuery } from "convex/react";
import ActivityHeatmap from "@/components/ActivityHeatmap";
import { api } from "@/convex/_generated/api";

export default function HabitHeatmap() {
  const habitActivity = useQuery(api.habits.getHabitActivity, {
    habitId: "habit_123",
  });

  if (!habitActivity) return null;

  // Transform Convex data to heatmap format
  const heatmapData = habitActivity.map((entry) => ({
    date: entry.date, // "YYYY-MM-DD" from Convex
    value: entry.completed ? 1 : 0,
  }));

  return (
    <ActivityHeatmap
      data={heatmapData}
      endDate={new Date()}
      numDays={365}
      width={350}
      height={150}
      tooltipDataAttrs={(value) => ({
        fill: value?.value === 0 ? "#e5e7eb" : "#10b981",
      })}
      onDayPress={(dataPoint) => {
        console.log("Day pressed:", dataPoint.date);
      }}
    />
  );
}
```

## Layout Options

### Horizontal (Default)

Weeks are displayed as columns from left to right:

```tsx
<ActivityHeatmap
  // ...
  horizontal={true}
  width={350}
  height={150}
/>
```

### Vertical

Weeks are displayed as rows from top to bottom:

```tsx
<ActivityHeatmap
  // ...
  horizontal={false}
  width={200}
  height={400}
/>
```

## Event Handling

```tsx
<ActivityHeatmap
  data={data}
  endDate={new Date()}
  numDays={365}
  width={350}
  height={150}
  tooltipDataAttrs={(value) => ({
    fill: value?.count === 0 ? "#e5e7eb" : "#10b981",
  })}
  onDayPress={(dataPoint) => {
    // dataPoint contains the activity data for that day
    console.log(`Clicked on ${dataPoint.date}: ${dataPoint.count} activities`);
    // Handle navigation or show details
  }}
/>
```

## Accessibility

Use the `titleForValue` prop to provide accessible descriptions:

```tsx
<ActivityHeatmap
  data={data}
  endDate={new Date()}
  numDays={365}
  width={350}
  height={150}
  tooltipDataAttrs={(value) => ({
    fill: value?.count === 0 ? "#e5e7eb" : "#10b981",
  })}
  titleForValue={(value) => {
    if (!value) return "No activity on this date";
    const date = new Date(value.date);
    const dateStr = date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    return `${dateStr}: ${value.count} completions`;
  }}
/>
```

## Performance Tips

1. **Memoize data**: For large datasets, memoize the data array to prevent unnecessary recalculations

```tsx
const memoizedData = useMemo(() => habitActivity, [habitActivity]);

<ActivityHeatmap
  data={memoizedData}
  // ...
/>
```

2. **Use accessor prop for custom data shapes**: If your data uses a different property name

```tsx
<ActivityHeatmap
  data={data}
  accessor="completions" // Use 'completions' instead of 'value'
  // ...
/>
```

3. **Lazy load data**: Load data on-demand for large date ranges

## Types

All TypeScript types are exported from the component:

```tsx
import type {
  ActivityHeatmapProps,
  HeatmapDataPoint,
  TooltipDataAttrsFunction,
} from "@/components/ActivityHeatmap";
```

## Browser/Platform Support

- iOS 12+
- Android 5+
- Web (React Native Web)

Requires:
- `react-native`: 0.81.5+
- `react-native-svg`: 15.12.1+

## Migration from Original ContributionGraph

This component is a refactored version of the react-native-chart-kit `ContributionGraph` component:

| Original | New |
|----------|-----|
| `ContributionGraph` | `ActivityHeatmap` |
| `values` prop | `data` prop |
| Class component | Functional component with hooks |
| Uses lodash | Uses native JavaScript (`Array.from`) |
| `classForValue` | `tooltipDataAttrs` |
| `chartConfig` | Direct SVG attributes |

## Changelog

### Version 1.0
- Converted from class-based component to functional component
- Removed lodash dependency (uses native Array.from)
- Improved TypeScript typing with stricter interfaces
- Added comprehensive JSDoc comments
- Aligned with project conventions (utility styles, naming patterns)
- Enhanced accessibility with better title/tooltip support
- Improved documentation and usage examples

## License

Part of the Habitribe project.
