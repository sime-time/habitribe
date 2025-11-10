/**
 * @fileoverview TypeScript types and interfaces for the ActivityHeatmap component.
 * Provides type-safe definitions for heatmap data, rendering, and configuration.
 */

import type { ViewStyle } from "react-native";
import type { RectProps } from "react-native-svg";

/**
 * Individual activity data point in the heatmap.
 * @template T - The type of the value property
 */
export interface HeatmapDataPoint<T = number> {
  /** The numeric value representing activity (e.g., habit completion count) */
  value: T;
  /** The date this data point represents */
  date: Date | string | number;
  /** Optional title/tooltip text for this data point */
  [key: string]: unknown;
}

/**
 * Cached data structure for a single day cell in the heatmap.
 */
export interface CachedHeatmapValue {
  /** The original data point */
  value: HeatmapDataPoint;
  /** Computed title for tooltip or accessibility */
  title: string | null;
  /** SVG attributes for the rect element (color, opacity, etc.) */
  tooltipDataAttrs: Partial<RectProps>;
}

/**
 * Function type for custom SVG attributes based on data point.
 * Allows customization of rect element styling per data point.
 *
 * @param value - The data point being rendered
 * @returns Partial RectProps to apply to the SVG rect element
 */
export type TooltipDataAttrsFunction = (
  value: HeatmapDataPoint | null,
) => Partial<RectProps>;

/**
 * Props for the ActivityHeatmap component.
 */
export interface ActivityHeatmapProps {
  /** Array of activity data points to render */
  data: HeatmapDataPoint[];

  /** The end date for the heatmap range */
  endDate: Date | string | number;

  /** Number of days to display in the heatmap (e.g., 365 for a year) */
  numDays: number;

  /** Width of the SVG element */
  width: number;

  /** Height of the SVG element */
  height: number;

  /** Spacing between cells in pixels (default: 1) */
  gutterSize?: number;

  /** Size of each square cell in pixels (default: 20) */
  squareSize?: number;

  /** If true, render horizontally (weeks as columns); vertical layout if false */
  horizontal?: boolean;

  /** If true, show month labels on the heatmap */
  showMonthLabels?: boolean;

  /** If true, show empty days outside the data range */
  showOutOfRangeDays?: boolean;

  /** Name of the property to use as the value accessor (default: "value") */
  accessor?: string;

  /** Optional custom function to get month label text */
  getMonthLabel?: (monthIndex: number) => string;

  /** Callback when a day cell is pressed */
  onDayPress?: (dataPoint: HeatmapDataPoint) => void;

  /** Function to generate SVG attributes (color, opacity, etc.) for each cell */
  tooltipDataAttrs: TooltipDataAttrsFunction;

  /** Optional function to generate title/tooltip for a data point */
  titleForValue?: (value: HeatmapDataPoint | null) => string;

  /** Optional custom style overrides */
  style?: Partial<ViewStyle>;

  /** Color configuration for the heatmap gradient */
  colorConfig?: {
    /** Function to map opacity value (0-1) to color */
    color: (opacity: number) => string;
  };
}

/**
 * Internal state for the ActivityHeatmap component.
 */
export interface ActivityHeatmapState {
  /** Maximum value in the dataset */
  maxValue: number;

  /** Minimum value in the dataset */
  minValue: number;

  /** Cached data points indexed by day index */
  valueCache: Record<number, CachedHeatmapValue>;
}
