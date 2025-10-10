# Sign-In Component Migration Example

This document shows how to migrate `app/(auth)/sign-in.tsx` from the old styling system to the new utility-first approach.

## Step 1: Update Imports

### Before
```tsx
import { createAuthStyles } from "@/assets/styles/auth.styles";
```

### After
```tsx
import { s } from "@/assets/styles/utility.styles";
import { createColorStyles } from "@/assets/styles/color.styles";
```

## Step 2: Update Component Setup

### Before
```tsx
export default function SignIn() {
  const { colors } = useTheme();
  const styles = createAuthStyles(colors);
  // ...
}
```

### After
```tsx
export default function SignIn() {
  const { colors } = useTheme();
  const c = createColorStyles(colors);
  // ...
}
```

## Step 3: Migrate Each Component

### Container (LinearGradient wrapper)

**Before:**
```tsx
<LinearGradient colors={colors.gradients.background} style={styles.container}>
```

**After:**
```tsx
<LinearGradient colors={colors.gradients.background} style={s.flex1}>
```

---

### SafeAreaView

**Before:**
```tsx
<SafeAreaView style={styles.safeArea}>
```

**After:**
```tsx
<SafeAreaView style={[s.flex1, s.px6]}>
```

---

### Header Section

**Before:**
```tsx
<View style={styles.header}>
  <Text style={styles.title}>Welcome to Habitribe!</Text>
  <Text style={styles.subtitle}>
    Sign in or create an account to continue
  </Text>
</View>
```

**After:**
```tsx
<View style={[s.pt8, s.pb6, s.gap3, s.itemsCenter]}>
  <Text style={[s.text2xl, s.fontBold, s.textCenter, c.textForeground]}>
    Welcome to Habitribe!
  </Text>
  <Text style={[s.textSm, s.textCenter, c.textMuted]}>
    Sign in or create an account to continue
  </Text>
</View>
```

---

### Form Container

**Before:**
```tsx
<View style={styles.form}>
```

**After:**
```tsx
<View style={[s.flex1, s.gap6]}>
```

---

### Auth Container (for inputs/buttons group)

**Before:**
```tsx
<View style={styles.authContainer}>
```

**After:**
```tsx
<View style={s.gap3}>
```

---

### Apple Button

**Before:**
```tsx
<TouchableOpacity
  disabled={loading}
  style={[styles.button, styles.appleButton]}
>
  <AntDesign name="apple" size={24} color={colors.background} />
  <Text style={[styles.buttonText, { color: colors.background }]}>
    Continue with Apple
  </Text>
</TouchableOpacity>
```

**After:**
```tsx
<TouchableOpacity
  disabled={loading}
  style={[s.button, c.bgForeground]}
>
  <AntDesign name="apple" size={24} color={colors.background} />
  <Text style={[s.textBase, s.fontMedium, c.textBackground]}>
    Continue with Apple
  </Text>
</TouchableOpacity>
```

---

### Google Button

**Before:**
```tsx
<TouchableOpacity
  disabled={loading}
  style={[styles.button, styles.googleButton]}
>
  <AntDesign name="google" size={24} color={colors.foreground} />
  <Text style={[styles.buttonText, { color: colors.foreground }]}>
    Continue with Google
  </Text>
</TouchableOpacity>
```

**After:**
```tsx
<TouchableOpacity
  disabled={loading}
  style={[
    s.button,
    s.border1,
    c.bgCard,
    c.borderDefault,
  ]}
>
  <AntDesign name="google" size={24} color={colors.foreground} />
  <Text style={[s.textBase, s.fontMedium, c.textForeground]}>
    Continue with Google
  </Text>
</TouchableOpacity>
```

---

### Divider Section

**Before:**
```tsx
<View style={styles.dividerContainer}>
  <View style={styles.divider} />
  <Text style={styles.muted}>or</Text>
  <View style={styles.divider} />
</View>
```

**After:**
```tsx
<View style={[s.flexRow, s.itemsCenter, s.gap4, s.my2]}>
  <View style={[s.flex1, s.divider, c.bgMuted]} />
  <Text style={[s.textSm, c.textMuted]}>or</Text>
  <View style={[s.flex1, s.divider, c.bgMuted]} />
</View>
```

**Note:** The `s.divider` utility provides a consistent 1px line with 0.3 opacity. For vertical spacing between elements, use `<View style={[s.divider, c.bgMuted]} />`.

---

### Email Input

**Before:**
```tsx
<TextInput
  style={styles.input}
  placeholder="Email"
  placeholderTextColor={colors.muted}
  onChangeText={setEmail}
  value={email}
  inputMode="email"
  autoCapitalize="none"
/>
```

**After:**
```tsx
<TextInput
  style={[
    s.input,
    s.textBase,
    s.fontMedium,
    c.bgCard,
    c.textForeground,
    c.borderDefault,
  ]}
  placeholder="Email"
  placeholderTextColor={colors.muted}
  onChangeText={setEmail}
  value={email}
  inputMode="email"
  autoCapitalize="none"
/>
```

---

### Primary Button (Email Continue)

**Before:**
```tsx
<TouchableOpacity onPress={handleSignIn} disabled={loading}>
  <LinearGradient colors={colors.gradients.primary} style={styles.button}>
    {loading ? (
      <ActivityIndicator size="small" color={colors.muted} />
    ) : (
      <Text style={styles.buttonText}>Continue with Email</Text>
    )}
  </LinearGradient>
</TouchableOpacity>
```

**After:**
```tsx
<TouchableOpacity onPress={handleSignIn} disabled={loading}>
  <LinearGradient colors={colors.gradients.primary} style={s.button}>
    {loading ? (
      <ActivityIndicator size="small" color={colors.muted} />
    ) : (
      <Text style={[s.textBase, s.fontMedium, c.textPrimaryForeground]}>
        Continue with Email
      </Text>
    )}
  </LinearGradient>
</TouchableOpacity>
```

---

## Complete Migrated Component Structure

Here's the skeleton of the migrated component:

```tsx
import { useAuthActions } from "@convex-dev/auth/react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ConvexError } from "convex/values";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  ActivityIndicator,
  Button,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { ZodError } from "zod";
import { s } from "@/assets/styles/utility.styles";
import { createColorStyles } from "@/assets/styles/color.styles";
import useTheme from "@/hooks/useTheme";
import { EmailSchema } from "@/validation/EmailSchema";

export default function SignIn() {
  const { colors } = useTheme();
  const c = createColorStyles(colors);
  const { signIn } = useAuthActions();

  const [step, setStep] = useState<"signIn" | { email: string }>("signIn");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  // ... handler functions stay the same ...

  return step === "signIn" ? (
    <LinearGradient colors={colors.gradients.background} style={s.flex1}>
      <StatusBar barStyle={colors.statusBarStyle} />
      <SafeAreaView style={[s.flex1, s.px6]}>
        <View style={[s.pt8, s.pb6, s.gap3, s.itemsCenter]}>
          {/* Header content */}
        </View>

        <View style={[s.flex1, s.gap6]}>
          {/* Form content */}
        </View>
      </SafeAreaView>
    </LinearGradient>
  ) : (
    // Verification screen - similar migration pattern
  );
}
```

## Benefits of This Approach

1. ✅ **No more style function overhead** - `createAuthStyles(colors)` removed
2. ✅ **Immediate visual feedback** - See layout directly in JSX
3. ✅ **Full autocomplete** - Type `s.` or `c.` and explore
4. ✅ **Consistent spacing** - All uses same 4px scale
5. ✅ **Easy refactoring** - Utilities are self-documenting
6. ✅ **Smaller bundle** - Shared utility objects
7. ✅ **Theme switching works** - `c.*` utilities regenerated on theme change

## Tips

- Start with one section at a time (header, then form, then buttons)
- Keep the old code commented out until you verify it works
- Use the README.md for quick reference of available utilities
- Test light/dark theme switching after migration
