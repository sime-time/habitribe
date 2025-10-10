import type { TextStyle, ViewStyle } from "react-native";
import {
  borderRadius,
  fontSize,
  fontWeight,
  spacing,
} from "@/assets/styles/token.styles";

/**
 * Utility-first design system styles
 * Usage: <View style={[s.flex1, s.p4, s.roundedLg]} />
 */
export const s = {
  // Layout & Flexbox
  flex1: { flex: 1 } as ViewStyle,
  flexRow: { flexDirection: "row" } as ViewStyle,
  flexCol: { flexDirection: "column" } as ViewStyle,
  flexWrap: { flexWrap: "wrap" } as ViewStyle,
  flexGrow: { flexGrow: 1 } as ViewStyle,

  // Alignment
  itemsCenter: { alignItems: "center" } as ViewStyle,
  itemsStart: { alignItems: "flex-start" } as ViewStyle,
  itemsEnd: { alignItems: "flex-end" } as ViewStyle,
  itemsStretch: { alignItems: "stretch" } as ViewStyle,

  justifyCenter: { justifyContent: "center" } as ViewStyle,
  justifyStart: { justifyContent: "flex-start" } as ViewStyle,
  justifyEnd: { justifyContent: "flex-end" } as ViewStyle,
  justifyBetween: { justifyContent: "space-between" } as ViewStyle,
  justifyAround: { justifyContent: "space-around" } as ViewStyle,
  justifyEvenly: { justifyContent: "space-evenly" } as ViewStyle,

  selfCenter: { alignSelf: "center" } as ViewStyle,
  selfStart: { alignSelf: "flex-start" } as ViewStyle,
  selfEnd: { alignSelf: "flex-end" } as ViewStyle,

  // Padding
  p0: { padding: spacing[0] } as ViewStyle,
  p1: { padding: spacing[1] } as ViewStyle,
  p2: { padding: spacing[2] } as ViewStyle,
  p3: { padding: spacing[3] } as ViewStyle,
  p4: { padding: spacing[4] } as ViewStyle,
  p5: { padding: spacing[5] } as ViewStyle,
  p6: { padding: spacing[6] } as ViewStyle,
  p8: { padding: spacing[8] } as ViewStyle,
  p10: { padding: spacing[10] } as ViewStyle,
  p12: { padding: spacing[12] } as ViewStyle,

  // Padding Horizontal
  px0: { paddingHorizontal: spacing[0] } as ViewStyle,
  px1: { paddingHorizontal: spacing[1] } as ViewStyle,
  px2: { paddingHorizontal: spacing[2] } as ViewStyle,
  px3: { paddingHorizontal: spacing[3] } as ViewStyle,
  px4: { paddingHorizontal: spacing[4] } as ViewStyle,
  px5: { paddingHorizontal: spacing[5] } as ViewStyle,
  px6: { paddingHorizontal: spacing[6] } as ViewStyle,
  px8: { paddingHorizontal: spacing[8] } as ViewStyle,

  // Padding Vertical
  py0: { paddingVertical: spacing[0] } as ViewStyle,
  py1: { paddingVertical: spacing[1] } as ViewStyle,
  py2: { paddingVertical: spacing[2] } as ViewStyle,
  py3: { paddingVertical: spacing[3] } as ViewStyle,
  py4: { paddingVertical: spacing[4] } as ViewStyle,
  py5: { paddingVertical: spacing[5] } as ViewStyle,
  py6: { paddingVertical: spacing[6] } as ViewStyle,
  py8: { paddingVertical: spacing[8] } as ViewStyle,

  // Padding Top
  pt1: { paddingTop: spacing[1] } as ViewStyle,
  pt2: { paddingTop: spacing[2] } as ViewStyle,
  pt3: { paddingTop: spacing[3] } as ViewStyle,
  pt4: { paddingTop: spacing[4] } as ViewStyle,
  pt6: { paddingTop: spacing[6] } as ViewStyle,
  pt8: { paddingTop: spacing[8] } as ViewStyle,

  // Padding Bottom
  pb1: { paddingBottom: spacing[1] } as ViewStyle,
  pb2: { paddingBottom: spacing[2] } as ViewStyle,
  pb3: { paddingBottom: spacing[3] } as ViewStyle,
  pb4: { paddingBottom: spacing[4] } as ViewStyle,
  pb6: { paddingBottom: spacing[6] } as ViewStyle,
  pb8: { paddingBottom: spacing[8] } as ViewStyle,

  // Padding Left
  pl1: { paddingLeft: spacing[1] } as ViewStyle,
  pl2: { paddingLeft: spacing[2] } as ViewStyle,
  pl3: { paddingLeft: spacing[3] } as ViewStyle,
  pl4: { paddingLeft: spacing[4] } as ViewStyle,
  pl6: { paddingLeft: spacing[6] } as ViewStyle,

  // Padding Right
  pr1: { paddingRight: spacing[1] } as ViewStyle,
  pr2: { paddingRight: spacing[2] } as ViewStyle,
  pr3: { paddingRight: spacing[3] } as ViewStyle,
  pr4: { paddingRight: spacing[4] } as ViewStyle,
  pr6: { paddingRight: spacing[6] } as ViewStyle,

  // Margin
  m0: { margin: spacing[0] } as ViewStyle,
  m1: { margin: spacing[1] } as ViewStyle,
  m2: { margin: spacing[2] } as ViewStyle,
  m3: { margin: spacing[3] } as ViewStyle,
  m4: { margin: spacing[4] } as ViewStyle,
  m6: { margin: spacing[6] } as ViewStyle,
  m8: { margin: spacing[8] } as ViewStyle,

  // Margin Horizontal
  mx1: { marginHorizontal: spacing[1] } as ViewStyle,
  mx2: { marginHorizontal: spacing[2] } as ViewStyle,
  mx4: { marginHorizontal: spacing[4] } as ViewStyle,
  mx6: { marginHorizontal: spacing[6] } as ViewStyle,

  // Margin Vertical
  my1: { marginVertical: spacing[1] } as ViewStyle,
  my2: { marginVertical: spacing[2] } as ViewStyle,
  my4: { marginVertical: spacing[4] } as ViewStyle,
  my6: { marginVertical: spacing[6] } as ViewStyle,

  // Margin Top
  mt1: { marginTop: spacing[1] } as ViewStyle,
  mt2: { marginTop: spacing[2] } as ViewStyle,
  mt3: { marginTop: spacing[3] } as ViewStyle,
  mt4: { marginTop: spacing[4] } as ViewStyle,
  mt6: { marginTop: spacing[6] } as ViewStyle,
  mt8: { marginTop: spacing[8] } as ViewStyle,

  // Margin Bottom
  mb1: { marginBottom: spacing[1] } as ViewStyle,
  mb2: { marginBottom: spacing[2] } as ViewStyle,
  mb3: { marginBottom: spacing[3] } as ViewStyle,
  mb4: { marginBottom: spacing[4] } as ViewStyle,
  mb6: { marginBottom: spacing[6] } as ViewStyle,
  mb8: { marginBottom: spacing[8] } as ViewStyle,

  // Margin Left
  ml1: { marginLeft: spacing[1] } as ViewStyle,
  ml2: { marginLeft: spacing[2] } as ViewStyle,
  ml4: { marginLeft: spacing[4] } as ViewStyle,

  // Margin Right
  mr1: { marginRight: spacing[1] } as ViewStyle,
  mr2: { marginRight: spacing[2] } as ViewStyle,
  mr4: { marginRight: spacing[4] } as ViewStyle,

  // Gap (flexbox gap - requires RN 0.71+)
  gap0: { gap: spacing[0] } as ViewStyle,
  gap1: { gap: spacing[1] } as ViewStyle,
  gap2: { gap: spacing[2] } as ViewStyle,
  gap3: { gap: spacing[3] } as ViewStyle,
  gap4: { gap: spacing[4] } as ViewStyle,
  gap5: { gap: spacing[5] } as ViewStyle,
  gap6: { gap: spacing[6] } as ViewStyle,
  gap8: { gap: spacing[8] } as ViewStyle,
  gap10: { gap: spacing[10] } as ViewStyle,
  gap12: { gap: spacing[12] } as ViewStyle,

  // Row Gap
  rowGap1: { rowGap: spacing[1] } as ViewStyle,
  rowGap2: { rowGap: spacing[2] } as ViewStyle,
  rowGap3: { rowGap: spacing[3] } as ViewStyle,
  rowGap4: { rowGap: spacing[4] } as ViewStyle,
  rowGap6: { rowGap: spacing[6] } as ViewStyle,
  rowGap8: { rowGap: spacing[8] } as ViewStyle,

  // Column Gap
  columnGap1: { columnGap: spacing[1] } as ViewStyle,
  columnGap2: { columnGap: spacing[2] } as ViewStyle,
  columnGap3: { columnGap: spacing[3] } as ViewStyle,
  columnGap4: { columnGap: spacing[4] } as ViewStyle,
  columnGap6: { columnGap: spacing[6] } as ViewStyle,
  columnGap8: { columnGap: spacing[8] } as ViewStyle,

  // Border Radius
  roundedNone: { borderRadius: borderRadius.none } as ViewStyle,
  roundedSm: { borderRadius: borderRadius.sm } as ViewStyle,
  rounded: { borderRadius: borderRadius.DEFAULT } as ViewStyle,
  roundedMd: { borderRadius: borderRadius.md } as ViewStyle,
  roundedLg: { borderRadius: borderRadius.lg } as ViewStyle,
  roundedXl: { borderRadius: borderRadius.xl } as ViewStyle,
  roundedFull: { borderRadius: borderRadius.full } as ViewStyle,

  // Border Width
  border0: { borderWidth: 0 } as ViewStyle,
  border1: { borderWidth: 1 } as ViewStyle,
  border2: { borderWidth: 2 } as ViewStyle,
  border3: { borderWidth: 3 } as ViewStyle,
  border4: { borderWidth: 4 } as ViewStyle,

  // Border Top Width
  borderT0: { borderTopWidth: 0 } as ViewStyle,
  borderT1: { borderTopWidth: 1 } as ViewStyle,
  borderT2: { borderTopWidth: 2 } as ViewStyle,

  // Border Bottom Width
  borderB0: { borderBottomWidth: 0 } as ViewStyle,
  borderB1: { borderBottomWidth: 1 } as ViewStyle,
  borderB2: { borderBottomWidth: 2 } as ViewStyle,

  // Border Left Width
  borderL0: { borderLeftWidth: 0 } as ViewStyle,
  borderL1: { borderLeftWidth: 1 } as ViewStyle,
  borderL2: { borderLeftWidth: 2 } as ViewStyle,

  // Border Right Width
  borderR0: { borderRightWidth: 0 } as ViewStyle,
  borderR1: { borderRightWidth: 1 } as ViewStyle,
  borderR2: { borderRightWidth: 2 } as ViewStyle,

  // Text Size
  textXs: { fontSize: fontSize.xs } as TextStyle,
  textSm: { fontSize: fontSize.sm } as TextStyle,
  textBase: { fontSize: fontSize.base } as TextStyle,
  textLg: { fontSize: fontSize.lg } as TextStyle,
  textXl: { fontSize: fontSize.xl } as TextStyle,
  text2xl: { fontSize: fontSize["2xl"] } as TextStyle,
  text3xl: { fontSize: fontSize["3xl"] } as TextStyle,
  text4xl: { fontSize: fontSize["4xl"] } as TextStyle,

  // Font Weight
  fontNormal: { fontWeight: fontWeight.normal } as TextStyle,
  fontMedium: { fontWeight: fontWeight.medium } as TextStyle,
  fontSemibold: { fontWeight: fontWeight.semibold } as TextStyle,
  fontBold: { fontWeight: fontWeight.bold } as TextStyle,

  // Text Alignment
  textLeft: { textAlign: "left" } as TextStyle,
  textCenter: { textAlign: "center" } as TextStyle,
  textRight: { textAlign: "right" } as TextStyle,

  // Position
  absolute: { position: "absolute" } as ViewStyle,
  relative: { position: "relative" } as ViewStyle,

  // Size
  wFull: { width: "100%" } as ViewStyle,
  hFull: { height: "100%" } as ViewStyle,

  // Overflow
  overflowHidden: { overflow: "hidden" } as ViewStyle,
  overflowVisible: { overflow: "visible" } as ViewStyle,

  // Opacity
  opacity0: { opacity: 0 } as ViewStyle,
  opacity50: { opacity: 0.5 } as ViewStyle,
  opacity75: { opacity: 0.75 } as ViewStyle,
  opacity100: { opacity: 1 } as ViewStyle,

  // Custom
  button: {
    borderWidth: 0,
    borderRadius: borderRadius.md,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[2],
    flexDirection: "row",
  },
  divider: {
    height: 1,
    opacity: 0.3,
  },
  input: {
    borderWidth: 2,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  inputHeight: {
    height: 51,
  },
} as const;

/**
 * Combine multiple utility styles
 * Usage: combine(s.flex1, s.p4, customStyle)
 */
export const combine = (
  ...styles: (ViewStyle | TextStyle | undefined | false | null)[]
) => {
  return Object.assign({}, ...styles.filter(Boolean));
};

// Export type for external use
export type Styles = typeof s;
