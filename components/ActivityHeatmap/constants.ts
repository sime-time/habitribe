/**
 * @fileoverview Constants used in ActivityHeatmap component.
 * Defines sizes, durations, and static label data.
 */

/** Size of each heatmap cell in pixels */
export const SQUARE_SIZE = 20;

/** Spacing between month label and cells */
export const MONTH_LABEL_GUTTER_SIZE = 8;

/** Padding on the left side of the SVG */
export const PADDING_LEFT = 32;

/** Milliseconds in a single day (24 * 60 * 60 * 1000) */
export const MILLISECONDS_IN_ONE_DAY = 24 * 60 * 60 * 1000;

/** Number of days in a week */
export const DAYS_IN_WEEK = 7;

/** Abbreviated month names for labels */
export const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;
