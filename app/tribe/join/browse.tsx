import { FlashList } from "@shopify/flash-list";
import { useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import Header from "@/components/Header";
import { api } from "@/convex/_generated/api";
import useTheme from "@/hooks/useTheme";

export default function BrowseTribes() {
  const { colors } = useTheme();
  const c = createColorStyles(colors);
  const publicTribes = useQuery(api.exec.read.getPublicTribes);

  return (
    <LinearGradient colors={colors.gradients.background} style={s.flex1}>
      <SafeAreaView style={s.flex1}>
        <Header title="Browse Tribes" />
        <FlashList
          data={publicTribes}
          renderItem={({ item }) => (
            <View
              style={[
                s.p4,
                s.roundedLg,
                c.bgCard,
                c.borderDefault,
                s.border1,
                s.flexRow,
                s.justifyBetween,
                s.itemsCenter,
              ]}
            >
              <Text style={[s.fontSemibold, s.textXl, c.textForeground]}>
                {item.name}
              </Text>
              <TouchableOpacity
                style={[s.py2, s.px5, s.roundedMd, c.bgPrimary]}
              >
                <Text style={[s.textBase, c.textPrimaryForeground]}>View</Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={s.px4}
        />
        <TouchableOpacity
          style={[s.button, c.bgTransparent]}
          onPress={() => router.back()}
        >
          <Text style={[s.textLg, c.textPrimary]}>Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}
