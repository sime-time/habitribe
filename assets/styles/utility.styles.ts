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
  p13: { padding: spacing[13] } as ViewStyle,
  p14: { padding: spacing[14] } as ViewStyle,
  p16: { padding: spacing[16] } as ViewStyle,

  // Padding Horizontal
  px0: { paddingHorizontal: spacing[0] } as ViewStyle,
  px1: { paddingHorizontal: spacing[1] } as ViewStyle,
  px2: { paddingHorizontal: spacing[2] } as ViewStyle,
  px3: { paddingHorizontal: spacing[3] } as ViewStyle,
  px4: { paddingHorizontal: spacing[4] } as ViewStyle,
  px5: { paddingHorizontal: spacing[5] } as ViewStyle,
  px6: { paddingHorizontal: spacing[6] } as ViewStyle,
  px8: { paddingHorizontal: spacing[8] } as ViewStyle,
  px10: { paddingHorizontal: spacing[10] } as ViewStyle,
  px12: { paddingHorizontal: spacing[12] } as ViewStyle,
  px13: { paddingHorizontal: spacing[13] } as ViewStyle,
  px14: { paddingHorizontal: spacing[14] } as ViewStyle,
  px16: { paddingHorizontal: spacing[16] } as ViewStyle,

  // Padding Vertical
  py0: { paddingVertical: spacing[0] } as ViewStyle,
  py1: { paddingVertical: spacing[1] } as ViewStyle,
  py2: { paddingVertical: spacing[2] } as ViewStyle,
  py3: { paddingVertical: spacing[3] } as ViewStyle,
  py4: { paddingVertical: spacing[4] } as ViewStyle,
  py5: { paddingVertical: spacing[5] } as ViewStyle,
  py6: { paddingVertical: spacing[6] } as ViewStyle,
  py8: { paddingVertical: spacing[8] } as ViewStyle,
  py10: { paddingVertical: spacing[10] } as ViewStyle,
  py12: { paddingVertical: spacing[12] } as ViewStyle,
  py13: { paddingVertical: spacing[13] } as ViewStyle,
  py14: { paddingVertical: spacing[14] } as ViewStyle,
  py16: { paddingVertical: spacing[16] } as ViewStyle,

  // Padding Top
  pt0: { paddingTop: spacing[0] } as ViewStyle,
  pt1: { paddingTop: spacing[1] } as ViewStyle,
  pt2: { paddingTop: spacing[2] } as ViewStyle,
  pt3: { paddingTop: spacing[3] } as ViewStyle,
  pt4: { paddingTop: spacing[4] } as ViewStyle,
  pt5: { paddingTop: spacing[5] } as ViewStyle,
  pt6: { paddingTop: spacing[6] } as ViewStyle,
  pt8: { paddingTop: spacing[8] } as ViewStyle,
  pt10: { paddingTop: spacing[10] } as ViewStyle,
  pt12: { paddingTop: spacing[12] } as ViewStyle,
  pt13: { paddingTop: spacing[13] } as ViewStyle,
  pt14: { paddingTop: spacing[14] } as ViewStyle,
  pt16: { paddingTop: spacing[16] } as ViewStyle,

  // Padding Bottom
  pb0: { paddingBottom: spacing[0] } as ViewStyle,
  pb1: { paddingBottom: spacing[1] } as ViewStyle,
  pb2: { paddingBottom: spacing[2] } as ViewStyle,
  pb3: { paddingBottom: spacing[3] } as ViewStyle,
  pb4: { paddingBottom: spacing[4] } as ViewStyle,
  pb5: { paddingBottom: spacing[5] } as ViewStyle,
  pb6: { paddingBottom: spacing[6] } as ViewStyle,
  pb8: { paddingBottom: spacing[8] } as ViewStyle,
  pb10: { paddingBottom: spacing[10] } as ViewStyle,
  pb12: { paddingBottom: spacing[12] } as ViewStyle,
  pb13: { paddingBottom: spacing[13] } as ViewStyle,
  pb14: { paddingBottom: spacing[14] } as ViewStyle,
  pb16: { paddingBottom: spacing[16] } as ViewStyle,

  // Padding Left
  pl0: { paddingLeft: spacing[0] } as ViewStyle,
  pl1: { paddingLeft: spacing[1] } as ViewStyle,
  pl2: { paddingLeft: spacing[2] } as ViewStyle,
  pl3: { paddingLeft: spacing[3] } as ViewStyle,
  pl4: { paddingLeft: spacing[4] } as ViewStyle,
  pl5: { paddingLeft: spacing[5] } as ViewStyle,
  pl6: { paddingLeft: spacing[6] } as ViewStyle,
  pl8: { paddingLeft: spacing[8] } as ViewStyle,
  pl10: { paddingLeft: spacing[10] } as ViewStyle,
  pl12: { paddingLeft: spacing[12] } as ViewStyle,
  pl13: { paddingLeft: spacing[13] } as ViewStyle,
  pl14: { paddingLeft: spacing[14] } as ViewStyle,
  pl16: { paddingLeft: spacing[16] } as ViewStyle,

  // Padding Right
  pr0: { paddingRight: spacing[0] } as ViewStyle,
  pr1: { paddingRight: spacing[1] } as ViewStyle,
  pr2: { paddingRight: spacing[2] } as ViewStyle,
  pr3: { paddingRight: spacing[3] } as ViewStyle,
  pr4: { paddingRight: spacing[4] } as ViewStyle,
  pr5: { paddingRight: spacing[5] } as ViewStyle,
  pr6: { paddingRight: spacing[6] } as ViewStyle,
  pr8: { paddingRight: spacing[8] } as ViewStyle,
  pr10: { paddingRight: spacing[10] } as ViewStyle,
  pr12: { paddingRight: spacing[12] } as ViewStyle,
  pr13: { paddingRight: spacing[13] } as ViewStyle,
  pr14: { paddingRight: spacing[14] } as ViewStyle,
  pr16: { paddingRight: spacing[16] } as ViewStyle,

  // Margin
  m0: { margin: spacing[0] } as ViewStyle,
  m1: { margin: spacing[1] } as ViewStyle,
  m2: { margin: spacing[2] } as ViewStyle,
  m3: { margin: spacing[3] } as ViewStyle,
  m4: { margin: spacing[4] } as ViewStyle,
  m5: { margin: spacing[5] } as ViewStyle,
  m6: { margin: spacing[6] } as ViewStyle,
  m8: { margin: spacing[8] } as ViewStyle,
  m10: { margin: spacing[10] } as ViewStyle,
  m12: { margin: spacing[12] } as ViewStyle,
  m13: { margin: spacing[13] } as ViewStyle,
  m14: { margin: spacing[14] } as ViewStyle,
  m16: { margin: spacing[16] } as ViewStyle,

  // Margin Horizontal
  mx0: { marginHorizontal: spacing[0] } as ViewStyle,
  mx1: { marginHorizontal: spacing[1] } as ViewStyle,
  mx2: { marginHorizontal: spacing[2] } as ViewStyle,
  mx3: { marginHorizontal: spacing[3] } as ViewStyle,
  mx4: { marginHorizontal: spacing[4] } as ViewStyle,
  mx5: { marginHorizontal: spacing[5] } as ViewStyle,
  mx6: { marginHorizontal: spacing[6] } as ViewStyle,
  mx8: { marginHorizontal: spacing[8] } as ViewStyle,
  mx10: { marginHorizontal: spacing[10] } as ViewStyle,
  mx12: { marginHorizontal: spacing[12] } as ViewStyle,
  mx13: { marginHorizontal: spacing[13] } as ViewStyle,
  mx14: { marginHorizontal: spacing[14] } as ViewStyle,
  mx16: { marginHorizontal: spacing[16] } as ViewStyle,

  // Margin Vertical
  my0: { marginVertical: spacing[0] } as ViewStyle,
  my1: { marginVertical: spacing[1] } as ViewStyle,
  my2: { marginVertical: spacing[2] } as ViewStyle,
  my3: { marginVertical: spacing[3] } as ViewStyle,
  my4: { marginVertical: spacing[4] } as ViewStyle,
  my5: { marginVertical: spacing[5] } as ViewStyle,
  my6: { marginVertical: spacing[6] } as ViewStyle,
  my8: { marginVertical: spacing[8] } as ViewStyle,
  my10: { marginVertical: spacing[10] } as ViewStyle,
  my12: { marginVertical: spacing[12] } as ViewStyle,
  my13: { marginVertical: spacing[13] } as ViewStyle,
  my14: { marginVertical: spacing[14] } as ViewStyle,
  my16: { marginVertical: spacing[16] } as ViewStyle,

  // Margin Top
  mt0: { marginTop: spacing[0] } as ViewStyle,
  mt1: { marginTop: spacing[1] } as ViewStyle,
  mt2: { marginTop: spacing[2] } as ViewStyle,
  mt3: { marginTop: spacing[3] } as ViewStyle,
  mt4: { marginTop: spacing[4] } as ViewStyle,
  mt5: { marginTop: spacing[5] } as ViewStyle,
  mt6: { marginTop: spacing[6] } as ViewStyle,
  mt8: { marginTop: spacing[8] } as ViewStyle,
  mt10: { marginTop: spacing[10] } as ViewStyle,
  mt12: { marginTop: spacing[12] } as ViewStyle,
  mt13: { marginTop: spacing[13] } as ViewStyle,
  mt14: { marginTop: spacing[14] } as ViewStyle,
  mt16: { marginTop: spacing[16] } as ViewStyle,

  // Margin Bottom
  mb0: { marginBottom: spacing[0] } as ViewStyle,
  mb1: { marginBottom: spacing[1] } as ViewStyle,
  mb2: { marginBottom: spacing[2] } as ViewStyle,
  mb3: { marginBottom: spacing[3] } as ViewStyle,
  mb4: { marginBottom: spacing[4] } as ViewStyle,
  mb5: { marginBottom: spacing[5] } as ViewStyle,
  mb6: { marginBottom: spacing[6] } as ViewStyle,
  mb8: { marginBottom: spacing[8] } as ViewStyle,
  mb10: { marginBottom: spacing[10] } as ViewStyle,
  mb12: { marginBottom: spacing[12] } as ViewStyle,
  mb13: { marginBottom: spacing[13] } as ViewStyle,
  mb14: { marginBottom: spacing[14] } as ViewStyle,
  mb16: { marginBottom: spacing[16] } as ViewStyle,

  // Margin Left
  ml0: { marginLeft: spacing[0] } as ViewStyle,
  ml1: { marginLeft: spacing[1] } as ViewStyle,
  ml2: { marginLeft: spacing[2] } as ViewStyle,
  ml3: { marginLeft: spacing[3] } as ViewStyle,
  ml4: { marginLeft: spacing[4] } as ViewStyle,
  ml5: { marginLeft: spacing[5] } as ViewStyle,
  ml6: { marginLeft: spacing[6] } as ViewStyle,
  ml8: { marginLeft: spacing[8] } as ViewStyle,
  ml10: { marginLeft: spacing[10] } as ViewStyle,
  ml12: { marginLeft: spacing[12] } as ViewStyle,
  ml13: { marginLeft: spacing[13] } as ViewStyle,
  ml14: { marginLeft: spacing[14] } as ViewStyle,
  ml16: { marginLeft: spacing[16] } as ViewStyle,

  // Margin Right
  mr0: { marginRight: spacing[0] } as ViewStyle,
  mr1: { marginRight: spacing[1] } as ViewStyle,
  mr2: { marginRight: spacing[2] } as ViewStyle,
  mr3: { marginRight: spacing[3] } as ViewStyle,
  mr4: { marginRight: spacing[4] } as ViewStyle,
  mr5: { marginRight: spacing[5] } as ViewStyle,
  mr6: { marginRight: spacing[6] } as ViewStyle,
  mr8: { marginRight: spacing[8] } as ViewStyle,
  mr10: { marginRight: spacing[10] } as ViewStyle,
  mr12: { marginRight: spacing[12] } as ViewStyle,
  mr13: { marginRight: spacing[13] } as ViewStyle,
  mr14: { marginRight: spacing[14] } as ViewStyle,
  mr16: { marginRight: spacing[16] } as ViewStyle,

  // Z-Index
  zBottom: { zIndex: -999 } as ViewStyle,
  zneg30: { zIndex: -30 } as ViewStyle,
  zneg20: { zIndex: -20 } as ViewStyle,
  zneg10: { zIndex: -10 } as ViewStyle,
  z0: { zIndex: 0 } as ViewStyle,
  z10: { zIndex: 10 } as ViewStyle,
  z20: { zIndex: 20 } as ViewStyle,
  z30: { zIndex: 30 } as ViewStyle,
  z40: { zIndex: 40 } as ViewStyle,
  z50: { zIndex: 50 } as ViewStyle,
  zTop: { zIndex: 999 } as ViewStyle,

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
  colGap1: { columnGap: spacing[1] } as ViewStyle,
  colGap2: { columnGap: spacing[2] } as ViewStyle,
  colGap3: { columnGap: spacing[3] } as ViewStyle,
  colGap4: { columnGap: spacing[4] } as ViewStyle,
  colGap6: { columnGap: spacing[6] } as ViewStyle,
  colGap8: { columnGap: spacing[8] } as ViewStyle,

  // Border Radius
  roundedNone: { borderRadius: borderRadius.none } as ViewStyle,
  roundedSm: { borderRadius: borderRadius.sm } as ViewStyle,
  rounded: { borderRadius: borderRadius.base } as ViewStyle,
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

  // Outline Width
  outline0: { outlineWidth: 0 } as ViewStyle,
  outline1: { outlineWidth: 1 } as ViewStyle,
  outline2: { outlineWidth: 2 } as ViewStyle,
  outline3: { outlineWidth: 3 } as ViewStyle,
  outline4: { outlineWidth: 4 } as ViewStyle,

  // Text Size
  text2xs: { fontSize: fontSize["2xs"] } as TextStyle,
  textXs: { fontSize: fontSize.xs } as TextStyle,
  textSm: { fontSize: fontSize.sm } as TextStyle,
  textBase: { fontSize: fontSize.base } as TextStyle,
  textLg: { fontSize: fontSize.lg } as TextStyle,
  textXl: { fontSize: fontSize.xl } as TextStyle,
  text2xl: { fontSize: fontSize["2xl"] } as TextStyle,
  text3xl: { fontSize: fontSize["3xl"] } as TextStyle,
  text4xl: { fontSize: fontSize["4xl"] } as TextStyle,

  // Font Weight
  fontThin: { fontWeight: fontWeight.thin } as TextStyle,
  fontLight: { fontWeight: fontWeight.light } as TextStyle,
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

  // Width
  w0: { width: spacing[0] } as ViewStyle,
  w1: { width: spacing[1] } as ViewStyle,
  w2: { width: spacing[2] } as ViewStyle,
  w3: { width: spacing[3] } as ViewStyle,
  w4: { width: spacing[4] } as ViewStyle,
  w5: { width: spacing[5] } as ViewStyle,
  w6: { width: spacing[6] } as ViewStyle,
  w8: { width: spacing[8] } as ViewStyle,
  w10: { width: spacing[10] } as ViewStyle,
  w12: { width: spacing[12] } as ViewStyle,
  w13: { width: spacing[13] } as ViewStyle,
  w14: { width: spacing[14] } as ViewStyle,
  w16: { width: spacing[16] } as ViewStyle,
  wFull: { width: "100%" } as ViewStyle,

  // Height
  h0: { height: spacing[0] } as ViewStyle,
  h1: { height: spacing[1] } as ViewStyle,
  h2: { height: spacing[2] } as ViewStyle,
  h3: { height: spacing[3] } as ViewStyle,
  h4: { height: spacing[4] } as ViewStyle,
  h5: { height: spacing[5] } as ViewStyle,
  h6: { height: spacing[6] } as ViewStyle,
  h8: { height: spacing[8] } as ViewStyle,
  h10: { height: spacing[10] } as ViewStyle,
  h12: { height: spacing[12] } as ViewStyle,
  h13: { height: spacing[13] } as ViewStyle,
  h14: { height: spacing[14] } as ViewStyle,
  h16: { height: spacing[16] } as ViewStyle,
  hFull: { height: "100%" } as ViewStyle,

  // Overflow
  overflowHidden: { overflow: "hidden" } as ViewStyle,
  overflowVisible: { overflow: "visible" } as ViewStyle,

  // Opacity
  opacity0: { opacity: 0 } as ViewStyle,
  opacity25: { opacity: 0.25 } as ViewStyle,
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
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
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
