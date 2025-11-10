# ActivityHeatmap - Quick Start Guide

## Installation

Already installed in your project! Just import it:

```tsx
import ActivityHeatmap from "@/components/ActivityHeatmap";
```

## Basic Example (Copy & Paste)

```tsx
import ActivityHeatmap from "@/components/ActivityHeatmap";
import useTheme from "@/hooks/useTheme";

export default function HabitHeatmap() {
  const { colors } = useTheme();

  const data = [
    { date: "2025-01-15", value: 5 },
    { date: "2025-01-16", value: 8 },
    { date: "2025-01-17", value: 0 },
    { date: "2025-01-18", value: 12 },
  ];

  return (
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
  );
}
```

## Props You'll Use Most

### Required
- `data` - Array of `{ date, value }`
- `endDate` - Today (or any date)
- `numDays` - How many days to show (365 = year)
- `width` - SVG width in pixels
- `height` - SVG height in pixels
- `tooltipDataAttrs` - Function returning color object

### Optional (Common)
- `onDayPress` - Handle day clicks
- `titleForValue` - Tooltip text
- `showMonthLabels` - Show month names (default: true)
- `horizontal` - Direction (default: true)

## Date Formats (all supported)

```tsx
// ISO string
{ date: "2025-01-15", value: 5 }

// Timestamp
{ date: 1705276800000, value: 5 }

// Date object
{ date: new Date("2025-01-15"), value: 5 }
```

## Color Examples

### Simple Binary (Done/Not Done)
```tsx
tooltipDataAttrs={(value) => ({
  fill: value?.value === 0 ? "#e5e7eb" : "#10b981",
})}
```

### Intensity Gradient
```tsx
tooltipDataAttrs={(value) => {
  const count = value?.value ?? 0;
  const colors = ["#fff", "#dbeafe", "#93c5fd", "#3b82f6", "#1e40af"];
  const index = Math.min(Math.floor(count / 2), colors.length - 1);
  return { fill: colors[index] };
}}
```

### With Theme Colors
```tsx
const { colors } = useTheme();

tooltipDataAttrs={(value) => ({
  fill: value?.value === 0 ? colors.muted : colors.primary,
})}
```

## Interactive Example

```tsx
const [selected, setSelected] = useState<string | null>(null);

<ActivityHeatmap
  data={data}
  endDate={new Date()}
  numDays={365}
  width={350}
  height={150}
  tooltipDataAttrs={(value) => ({
    fill: value?.value === 0 ? "#e5e7eb" : "#10b981",
    stroke: selected === value?.date ? "#000" : "none",
  })}
  onDayPress={(day) => setSelected(day.date as string)}
/>
```

## Accessibility

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
  titleForValue={(value) => {
    if (!value) return "No activity";
    const date = new Date(value.date);
    return `${date.toLocaleDateString()}: ${value.value} times`;
  }}
/>
```

## Common Sizes

### Small (Monthly)
```tsx
<ActivityHeatmap
  numDays={30}
  width={280}
  height={100}
  squareSize={14}
  gutterSize={1}
  // ...
/>
```

### Medium (Quarterly)
```tsx
<ActivityHeatmap
  numDays={90}
  width={350}
  height={150}
  squareSize={16}
  gutterSize={2}
  // ...
/>
```

### Large (Yearly)
```tsx
<ActivityHeatmap
  numDays={365}
  width={350}
  height={150}
  squareSize={20}
  gutterSize={2}
  // ...
/>
```

## Vertical Layout

```tsx
<ActivityHeatmap
  data={data}
  endDate={new Date()}
  numDays={90}
  width={200}
  height={500}
  horizontal={false}  // Key prop!
  showMonthLabels={false}  // Usually omit for vertical
  // ...
/>
```

## Generate Sample Data

```tsx
const generateSampleData = (numDays: number) => {
  const result = [];
  const endDate = new Date();

  for (let i = numDays; i > 0; i--) {
    const date = new Date(endDate);
    date.setDate(date.getDate() - i);

    result.push({
      date: date.toISOString().split("T")[0], // "YYYY-MM-DD"
      value: Math.random() < 0.3 ? 0 : Math.floor(Math.random() * 5) + 1,
    });
  }

  return result;
};

const data = generateSampleData(365);
```

## TypeScript Tips

```tsx
import type { HeatmapDataPoint } from "@/components/ActivityHeatmap";

const myData: HeatmapDataPoint[] = [
  { date: "2025-01-15", value: 5 },
];

// Or extend for custom fields
interface MyActivityData extends HeatmapDataPoint {
  habitId: string;
  notes?: string;
}
```

## Performance Tips

1. **Memoize data** if it comes from a query:
```tsx
const data = useMemo(() => queryResult, [queryResult]);
```

2. **Use accessor** for different property names:
```tsx
<ActivityHeatmap
  data={data}
  accessor="completions"  // Instead of "value"
  // ...
/>
```

3. **Lazy load** for large date ranges:
```tsx
// Only load 90 days at a time
<ActivityHeatmap
  data={loadedData}
  numDays={90}
  // ...
/>
```

## Common Patterns

### With Convex Query
```tsx
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const entries = useQuery(api.habits.getEntries, { habitId });

const data = entries?.map(e => ({
  date: e.date,
  value: e.completed ? 1 : 0,
})) ?? [];

<ActivityHeatmap
  data={data}
  endDate={new Date()}
  numDays={365}
  // ...
/>
```

### In a Card
```tsx
import { s } from "@/assets/styles/utility.styles";

<View style={[s.p4, s.roundedLg, c.bgCard]}>
  <Text style={[s.textLg, s.fontBold]}>Activity</Text>
  <ActivityHeatmap
    data={data}
    endDate={new Date()}
    numDays={365}
    width={350}
    height={150}
    // ...
  />
</View>
```

## Troubleshooting

### Not showing data
- Check date format matches: `"YYYY-MM-DD"`, timestamp, or Date object
- Verify `endDate` is after your data dates
- Check `numDays` is large enough to include all dates

### Wrong colors
- Ensure `tooltipDataAttrs` function returns valid fill color
- Test with hardcoded color first: `fill: "#10b981"`

### Layout issues
- Use `width` and `height` that fit your container
- For vertical, use `horizontal={false}`
- Adjust `squareSize` and `gutterSize` for different scales

### Dates off by one day
- This is usually a timezone issue
- Convert dates to `"YYYY-MM-DD"` format on client side
- The component uses beginning of day (00:00:00)

## API Reference

### Main Component
```tsx
interface ActivityHeatmapProps {
  // Required
  data: HeatmapDataPoint[];
  endDate: Date | string | number;
  numDays: number;
  width: number;
  height: number;
  tooltipDataAttrs: (value: HeatmapDataPoint | null) => Partial<RectProps>;

  // Optional
  gutterSize?: number;              // default: 1
  squareSize?: number;              // default: 20
  horizontal?: boolean;             // default: true
  showMonthLabels?: boolean;        // default: true
  showOutOfRangeDays?: boolean;     // default: false
  accessor?: string;                // default: "value"
  getMonthLabel?: (index) => string;
  onDayPress?: (data) => void;
  titleForValue?: (value) => string;
  style?: Partial<ViewStyle>;
  colorConfig?: { color: (opacity) => string };
}
```

### Data Format
```tsx
interface HeatmapDataPoint {
  date: Date | string | number;
  value: number;
  [key: string]: unknown;  // Additional custom fields
}
```

## Learn More

- Full docs: `README.md`
- Examples: `USAGE_EXAMPLE.tsx`
- Technical details: `CONVERSION_SUMMARY.md`
- Type definitions: `types.ts`

## Questions?

Check the README.md for comprehensive documentation and more examples!
