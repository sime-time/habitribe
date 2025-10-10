# Simplified Color System

## Overview

The color scheme has been reduced to **7 essential colors** (plus gradients) that cover all use cases while maintaining simplicity and consistency.

## Color Palette

### Base Colors (3)
| Color | Purpose | Example Use |
|-------|---------|-------------|
| `background` | App background | Main screen background |
| `foreground` | Primary text | Headings, body text, icons |
| `card` | Elevated surfaces | Cards, modals, sheets, inputs |

### Border & Dividers (1)
| Color | Purpose | Example Use |
|-------|---------|-------------|
| `border` | Dividers & outlines | Input borders, dividers, card edges |

### Brand Colors (2)
| Color | Purpose | Example Use |
|-------|---------|-------------|
| `primary` | Brand color | Buttons, links, highlights, active states |
| `primaryForeground` | Text on primary | Button text, text on primary background |

### Muted/Secondary (1)
| Color | Purpose | Example Use |
|-------|---------|-------------|
| `muted` | Secondary text & subtle backgrounds | Hints, placeholders, captions, disabled states |

### Semantic States (3)
| Color | Purpose | Example Use |
|-------|---------|-------------|
| `success` | Positive feedback | Success messages, completion states |
| `warning` | Caution | Warnings, alerts that need attention |
| `destructive` | Errors & danger | Error messages, delete actions |

### Gradients (Optional)
| Gradient | Purpose |
|----------|---------|
| `gradients.background` | Background gradient for screens |
| `gradients.primary` | Primary button gradient |

---

## How Colors Map to Use Cases

### Text Colors
```tsx
// Primary text (headings, body)
c.textForeground

// Secondary text (captions, hints, timestamps)
c.textMuted

// Text on primary buttons
c.textPrimaryForeground

// Text on light backgrounds (like dark buttons)
c.textBackground

// Semantic text
c.textSuccess, c.textWarning, c.textDestructive
```

### Background Colors
```tsx
// Main app background
c.bgBackground

// Cards, modals, elevated surfaces
c.bgCard

// Subtle backgrounds (disabled, secondary)
c.bgMuted

// Primary buttons
c.bgPrimary

// Semantic backgrounds
c.bgSuccess, c.bgWarning, c.bgDestructive
```

### Borders
```tsx
// Default borders (inputs, cards, dividers)
c.borderDefault

// Primary borders (focus, active)
c.borderPrimary

// Semantic borders
c.borderSuccess, c.borderWarning, c.borderDestructive
```

---

## Common Patterns

### Text Input
```tsx
<TextInput
  style={[
    s.px6,
    s.py4,
    s.roundedMd,
    s.textBase,
    s.border1,
    c.bgCard,         // Use card for input background
    c.textForeground,
    c.borderDefault,
  ]}
  placeholderTextColor={colors.muted}
/>
```

### Card Component
```tsx
<View style={[s.p4, s.roundedLg, s.border1, c.bgCard, c.borderDefault]}>
  <Text style={[s.textLg, s.fontBold, c.textForeground]}>
    Card Title
  </Text>
  <Text style={[s.textSm, c.textMuted]}>
    Card description
  </Text>
</View>
```

### Primary Button
```tsx
<TouchableOpacity style={[s.px6, s.py4, s.roundedMd, c.bgPrimary]}>
  <Text style={[s.fontSemibold, c.textPrimaryForeground]}>
    Save Changes
  </Text>
</TouchableOpacity>
```

### Secondary Button (Outline)
```tsx
<TouchableOpacity
  style={[
    s.px6,
    s.py4,
    s.roundedMd,
    s.border1,
    c.bgCard,        // Light background
    c.borderDefault,
  ]}
>
  <Text style={[s.fontSemibold, c.textForeground]}>
    Cancel
  </Text>
</TouchableOpacity>
```

### Disabled State
```tsx
<TouchableOpacity
  disabled
  style={[
    s.px6,
    s.py4,
    s.roundedMd,
    c.bgMuted,        // Muted background
    s.opacity50,      // Reduced opacity
  ]}
>
  <Text style={[s.fontSemibold, c.textMuted]}>
    Disabled
  </Text>
</TouchableOpacity>
```

### Error/Destructive Action
```tsx
<TouchableOpacity style={[s.px6, s.py4, s.roundedMd, c.bgDestructive]}>
  <Text style={[s.fontSemibold, c.textPrimaryForeground]}>
    Delete Account
  </Text>
</TouchableOpacity>
```

### Success Message
```tsx
<View style={[s.p4, s.roundedMd, c.bgSuccess, s.opacity75]}>
  <Text style={[s.fontMedium, c.textPrimaryForeground]}>
    Changes saved successfully!
  </Text>
</View>
```

---

## Design Decisions

### What Was Removed and Why

| Removed Color | Replacement | Reason |
|---------------|-------------|--------|
| `backgroundSecondary` | `muted` | Redundant - muted serves same purpose |
| `foregroundSecondary` | `muted` | Redundant - same semantic meaning |
| `cardForeground` | `foreground` | Unnecessary - foreground works on card |
| `input` | `card` | Redundant - inputs use card background |
| `secondary` | `muted` or `border` | Unclear purpose - replaced by clearer names |
| `secondaryForeground` | `foreground` | Redundant |
| `info` | `primary` or custom | Can use primary for info states if needed |

### Benefits

1. ✅ **Simpler mental model** - Only 7 core colors to remember
2. ✅ **Clear semantics** - Each color has one clear purpose
3. ✅ **Less decision fatigue** - Fewer choices = faster development
4. ✅ **Easier maintenance** - Fewer colors to keep in sync
5. ✅ **Better consistency** - Reduced chance of color misuse

---

## Migration Notes

If you were using removed colors:

```tsx
// Before: c.bgInput
// After:  c.bgCard (or c.bgMuted for subtle inputs)

// Before: c.textForegroundSecondary
// After:  c.textMuted

// Before: c.bgSecondary
// After:  c.bgMuted

// Before: c.borderInput
// After:  c.borderDefault

// Before: c.textInfo
// After:  c.textPrimary (or keep custom info color if critical)
```

---

## When to Add New Colors

Only add new colors if:
1. You have a **distinct semantic purpose** not covered by existing colors
2. The color appears **frequently** across the app
3. The color needs to **change with theme** (light/dark)

Otherwise, use inline styles or custom StyleSheet for one-off colors.

## Full Color Reference

```tsx
const c = createColorStyles(colors);

// Backgrounds (9)
c.bgBackground
c.bgForeground
c.bgCard
c.bgPrimary
c.bgPrimaryForeground
c.bgMuted
c.bgSuccess
c.bgWarning
c.bgDestructive

// Text (9)
c.textBackground
c.textForeground
c.textCard
c.textPrimary
c.textPrimaryForeground
c.textMuted
c.textSuccess
c.textWarning
c.textDestructive

// Borders (6)
c.borderDefault
c.borderPrimary
c.borderMuted
c.borderSuccess
c.borderWarning
c.borderDestructive
```

Total: **24 utility classes** from **7 base colors** (+ 3 semantic states) 🎨
