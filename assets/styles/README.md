# Utility-First Design System

This design system provides a Tailwind-inspired utility-first approach for styling React Native components with full theme support.

## Quick Start

```tsx
import { s } from "@/assets/styles/utility.styles";
import { createColorStyles } from "@/assets/styles/color.styles";
import useTheme from "@/hooks/useTheme";

export default function MyComponent() {
  const { colors } = useTheme();
  const c = createColorStyles(colors);

  return (
    <View style={[s.flex1, s.p4, c.bgCard]}>
      <Text style={[s.textLg, s.fontBold, c.textForeground]}>
        Hello World
      </Text>
    </View>
  );
}
```

## Two Namespaces

### `s.*` - Static Utilities (Layout, Spacing, Typography)
Static styles that don't depend on theme colors:
- Layout: `s.flex1`, `s.flexRow`, `s.itemsCenter`, `s.justifyBetween`
- Spacing: `s.p4`, `s.px6`, `s.mt2`, `s.gap4`
- Typography: `s.textLg`, `s.fontBold`, `s.textCenter`
- Borders: `s.roundedMd`, `s.border15`
- Position: `s.absolute`, `s.relative`
- Size: `s.wFull`, `s.hFull`

### `c.*` - Color Utilities (Theme-aware)
Dynamic color styles that respond to light/dark theme:
- Backgrounds: `c.bgPrimary`, `c.bgCard`, `c.bgInput`
- Text: `c.textForeground`, `c.textMuted`, `c.textPrimary`
- Borders: `c.borderDefault`, `c.borderPrimary`
- States: `c.bgSuccess`, `c.textDestructive`, `c.borderWarning`

## Common Patterns

### Card Component
```tsx
<View style={[s.p4, s.roundedLg, s.gap3, c.bgCard, c.borderDefault, s.border1]}>
  <Text style={[s.textLg, s.fontBold, c.textForeground]}>
    Card Title
  </Text>
  <Text style={[s.textSm, c.textMuted]}>
    Card description
  </Text>
</View>
```

### Button Component
```tsx
<TouchableOpacity style={[s.button, c.bgPrimary]}>
  <Text style={[s.textBase, s.fontSemibold, c.textPrimaryForeground]}>
    Press Me
  </Text>
</TouchableOpacity>
```

### Text Input
```tsx
<TextInput
  style={[
    s.input,
    s.textBase,
    c.bgCard,
    c.textForeground,
    c.borderDefault
  ]}
  placeholderTextColor={colors.muted}
/>
```

### Horizontal List with Gap
```tsx
<View style={[s.flexRow, s.gap3, s.itemsCenter]}>
  <Icon />
  <Text style={[s.textBase, c.textForeground]}>Label</Text>
  <Badge />
</View>
```

### Centered Container
```tsx
<View style={[s.flex1, s.itemsCenter, s.justifyCenter, c.bgBackground]}>
  <Text style={[s.text2xl, s.fontBold, c.textForeground]}>
    Centered Content
  </Text>
</View>
```

## Migration from Old Styles

### Before (old pattern)
```tsx
import { createAuthStyles } from "@/assets/styles/auth.styles";

const styles = createAuthStyles(colors);

<View style={styles.container}>
  <Text style={styles.title}>Title</Text>
</View>
```

### After (new pattern)
```tsx
import { s } from "@/assets/styles/utility.styles";
import { createColorStyles } from "@/assets/styles/color.styles";

const c = createColorStyles(colors);

<View style={s.flex1}>
  <Text style={[s.text2xl, s.fontBold, c.textForeground]}>Title</Text>
</View>
```

## Available Utilities

### Layout & Flexbox
- `s.flex1` - flex: 1
- `s.flexRow` - flexDirection: row
- `s.flexCol` - flexDirection: column
- `s.flexWrap` - flexWrap: wrap
- `s.itemsCenter`, `s.itemsStart`, `s.itemsEnd`, `s.itemsStretch`
- `s.justifyCenter`, `s.justifyStart`, `s.justifyEnd`, `s.justifyBetween`, `s.justifyAround`, `s.justifyEvenly`
- `s.selfCenter`, `s.selfStart`, `s.selfEnd`

### Spacing (4px scale: 1=4px, 2=8px, 3=12px, 4=16px, etc.)
- Padding: `s.p1` to `s.p12`
- Horizontal: `s.px1` to `s.px8`
- Vertical: `s.py1` to `s.py8`
- Top: `s.pt1` to `s.pt8`
- Bottom: `s.pb1` to `s.pb8`
- Left: `s.pl1` to `s.pl6`
- Right: `s.pr1` to `s.pr6`
- Margin: `s.m0` to `s.m8`
- Margin variants: `s.mx*`, `s.my*`, `s.mt*`, `s.mb*`, `s.ml*`, `s.mr*`

### Gap (Flexbox spacing)
- Gap: `s.gap1` to `s.gap12`
- Row gap: `s.rowGap1` to `s.rowGap8`
- Column gap: `s.columnGap1` to `s.columnGap8`

### Border Radius
- `s.roundedNone`, `s.roundedSm`, `s.rounded`, `s.roundedMd`, `s.roundedLg`, `s.roundedXl`, `s.roundedFull`

### Border Width
- All sides: `s.border0`, `s.border1`, `s.border2`, `s.border3`, `s.border4`
- Directional: `s.borderT*`, `s.borderB*`, `s.borderL*`, `s.borderR*`

### Typography
- Size: `s.textXs`, `s.textSm`, `s.textBase`, `s.textLg`, `s.textXl`, `s.text2xl`, `s.text3xl`, `s.text4xl`
- Weight: `s.fontNormal`, `s.fontMedium`, `s.fontSemibold`, `s.fontBold`
- Align: `s.textLeft`, `s.textCenter`, `s.textRight`

### Position & Size
- `s.absolute`, `s.relative`
- `s.wFull` (width: 100%), `s.hFull` (height: 100%)

### Overflow & Opacity
- `s.overflowHidden`, `s.overflowVisible`
- `s.opacity0`, `s.opacity50`, `s.opacity75`, `s.opacity100`

### Color Utilities

#### Backgrounds
`c.bgBackground`, `c.bgForeground`, `c.bgCard`, `c.bgPrimary`, `c.bgPrimaryForeground`, `c.bgMuted`, `c.bgSuccess`, `c.bgWarning`, `c.bgDestructive`

#### Text Colors
`c.textBackground`, `c.textForeground`, `c.textCard`, `c.textPrimary`, `c.textPrimaryForeground`, `c.textMuted`, `c.textSuccess`, `c.textWarning`, `c.textDestructive`

#### Border Colors
`c.borderDefault`, `c.borderPrimary`, `c.borderMuted`, `c.borderSuccess`, `c.borderWarning`, `c.borderDestructive`

### Custom Utilities

#### Component Presets
- `s.button` - Standard button preset (px6, py4, roundedMd, centered flex layout)
- `s.input` - Text input preset (px6, py4, roundedMd, border2)
- `s.inputHeight` - Fixed input height (51px)
- `s.divider` - Horizontal divider line (height: 1px, opacity: 0.3)

## Tips

1. **Combine utilities freely** - React Native's style array merges them efficiently
2. **Use gap instead of margin** - Cleaner for flex layouts
3. **Colors always from `c.*`** - Never hardcode colors
4. **Layout from `s.*`** - Spacing, flex, typography
5. **Autocomplete is your friend** - Type `s.` or `c.` and explore

## Performance

- ✅ All utilities are plain objects (no StyleSheet overhead)
- ✅ Color utilities created once per component render (minimal cost)
- ✅ Static utilities (`s.*`) are shared across entire app
- ✅ Array styles are efficiently merged by React Native
