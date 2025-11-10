/**
 * @fileoverview ActivityHeatmap component - displays activity data as a GitHub-style heatmap.
 *
 * Renders a grid of colored squares representing activity levels over time.
 * Each square's color/opacity indicates the activity value for that day.
 * Supports both horizontal and vertical layouts, month labels, and click handlers.
 *
 * @example
 * ```tsx
 * import ActivityHeatmap from '@/components/ActivityHeatmap';
 *
 * const activityData = [
 *   { date: '2025-01-15', value: 5 },
 *   { date: '2025-01-16', value: 8 },
 * ];
 *
 * <ActivityHeatmap
 *   data={activityData}
 *   endDate={new Date()}
 *   numDays={365}
 *   width={300}
 *   height={200}
 *   tooltipDataAttrs={(value) => ({
 *     fill: value ? '#10b981' : '#e5e7eb',
 *   })}
 * />
 * ```
 */

import React, { useCallback, useMemo } from "react";
import { View } from "react-native";
import { G, Rect, Svg, Text } from "react-native-svg";
import {
  DAYS_IN_WEEK,
  MILLISECONDS_IN_ONE_DAY,
  MONTH_LABEL_GUTTER_SIZE,
  MONTH_LABELS,
  PADDING_LEFT,
  SQUARE_SIZE,
} from "./constants";
import type {
  ActivityHeatmapProps,
  ActivityHeatmapState,
  CachedHeatmapValue,
  HeatmapDataPoint,
} from "./types";
import {
  convertToDate,
  getBeginningTimeForDate,
  mapValue,
  range,
  shiftDate,
} from "./utils";

/**
 * ActivityHeatmap component - GitHub-style activity heatmap visualization
 *
 * Displays activity data as a grid of colored squares representing different
 * activity levels. Supports customizable sizing, spacing, and styling.
 *
 * @param props - Component props
 * @returns Rendered heatmap component
 */
export default function ActivityHeatmap({
  data,
  endDate,
  numDays,
  width,
  height,
  gutterSize = 1,
  squareSize = SQUARE_SIZE,
  horizontal = true,
  showMonthLabels = true,
  showOutOfRangeDays = false,
  accessor = "value",
  getMonthLabel,
  onDayPress,
  tooltipDataAttrs,
  titleForValue,
  style = {},
  colorConfig,
}: ActivityHeatmapProps) {
  /**
   * Calculate the ending date with proper timezone handling
   */
  const calculatedEndDate = useMemo(() => {
    return getBeginningTimeForDate(convertToDate(endDate));
  }, [endDate]);

  /**
   * Calculate the starting date based on numDays
   */
  const calculatedStartDate = useMemo(() => {
    return shiftDate(calculatedEndDate, -numDays + 1);
  }, [calculatedEndDate, numDays]);

  /**
   * Count empty days at the start (for alignment with week)
   */
  const numEmptyDaysAtStart = useMemo(() => {
    return calculatedStartDate.getDay();
  }, [calculatedStartDate]);

  /**
   * Calculate start date including empty days
   */
  const startDateWithEmptyDays = useMemo(() => {
    return shiftDate(calculatedStartDate, -numEmptyDaysAtStart);
  }, [calculatedStartDate, numEmptyDaysAtStart]);

  /**
   * Count empty days at the end (for alignment with week)
   */
  const numEmptyDaysAtEnd = useMemo(() => {
    return DAYS_IN_WEEK - 1 - calculatedEndDate.getDay();
  }, [calculatedEndDate]);

  /**
   * Calculate week count for rendering
   */
  const weekCount = useMemo(() => {
    const numDaysRoundedToWeek =
      numDays + numEmptyDaysAtStart + numEmptyDaysAtEnd;
    return Math.ceil(numDaysRoundedToWeek / DAYS_IN_WEEK);
  }, [numDays, numEmptyDaysAtStart, numEmptyDaysAtEnd]);

  /**
   * Build and cache the value data indexed by day
   */
  const cachedState = useMemo<ActivityHeatmapState>(() => {
    let minValue = Infinity;
    let maxValue = -Infinity;

    const valueCache: Record<number, CachedHeatmapValue> = {};

    data.forEach((dataPoint) => {
      const dateValue = convertToDate(dataPoint.date);
      const dayIndex = Math.floor(
        (dateValue.valueOf() - startDateWithEmptyDays.valueOf()) /
          MILLISECONDS_IN_ONE_DAY,
      );

      const countValue = dataPoint[accessor] as number;

      if (typeof countValue === "number") {
        minValue = Math.min(countValue, minValue);
        maxValue = Math.max(countValue, maxValue);
      }

      valueCache[dayIndex] = {
        value: dataPoint,
        title: titleForValue ? titleForValue(dataPoint) : null,
        tooltipDataAttrs: tooltipDataAttrs(dataPoint),
      };
    });

    // Handle edge case where all values are the same
    if (minValue === Infinity) {
      minValue = 0;
    }
    if (maxValue === -Infinity) {
      maxValue = 0;
    }

    return {
      valueCache,
      minValue: minValue === maxValue ? 0 : minValue,
      maxValue,
    };
  }, [data, startDateWithEmptyDays, accessor, titleForValue, tooltipDataAttrs]);

  /**
   * Get cached value for a specific index
   */
  const getValueForIndex = useCallback(
    (index: number): HeatmapDataPoint | null => {
      return cachedState.valueCache[index]?.value ?? null;
    },
    [cachedState],
  );

  /**
   * Calculate opacity for a day index based on its count value
   */
  const getOpacityForIndex = useCallback(
    (index: number): number => {
      const cached = cachedState.valueCache[index];

      if (!cached?.value) {
        return 0.15;
      }

      const countValue = cached.value[accessor] as number | null | undefined;

      if (countValue == null || countValue === 0) {
        return 0.15;
      }

      // Map the count value to opacity range [0.2, 1.0]
      const opacity = mapValue(
        countValue,
        cachedState.minValue,
        cachedState.maxValue,
        0.2, // minimum opacity for non-zero values
        1.0, // maximum opacity
      );

      return opacity;
    },
    [cachedState, accessor],
  );

  /**
   * Get title/tooltip for a day index
   */
  const getTitleForIndex = useCallback(
    (index: number): string | null => {
      return cachedState.valueCache[index]?.title ?? null;
    },
    [cachedState],
  );

  /**
   * Get SVG attributes for a day index
   */
  const getAttrsForIndex = useCallback(
    (index: number): Record<string, unknown> => {
      const cached = cachedState.valueCache[index];
      if (cached) {
        return cached.tooltipDataAttrs;
      }
      return tooltipDataAttrs(null);
    },
    [cachedState, tooltipDataAttrs],
  );

  /**
   * Handle day press event
   */
  const handleDayPress = useCallback(
    (index: number) => {
      if (!onDayPress) return;

      const cached = getValueForIndex(index);

      if (cached) {
        onDayPress(cached);
      } else {
        // Create empty data point for the day
        const emptyDataPoint: HeatmapDataPoint = {
          value: 0,
          date: new Date(
            calculatedStartDate.valueOf() + index * MILLISECONDS_IN_ONE_DAY,
          ),
        };
        onDayPress(emptyDataPoint);
      }
    },
    [getValueForIndex, onDayPress, calculatedStartDate],
  );

  /**
   * Calculate square size with gutter
   */
  const squareSizeWithGutter = squareSize + gutterSize;

  /**
   * Get coordinates for a square in a week
   */
  const getSquareCoordinates = (dayIndex: number): [number, number] => {
    if (horizontal) {
      return [0, dayIndex * squareSizeWithGutter];
    }
    return [dayIndex * squareSizeWithGutter, 0];
  };

  /**
   * Get transform for a week group
   */
  const getTransformForWeek = (weekIndex: number): [number, number] => {
    if (horizontal) {
      return [weekIndex * squareSizeWithGutter, 50];
    }
    return [10, weekIndex * squareSizeWithGutter];
  };

  /**
   * Get month label coordinates
   */
  const getMonthLabelCoordinates = (weekIndex: number): [number, number] => {
    if (horizontal) {
      return [weekIndex * squareSizeWithGutter, MONTH_LABEL_GUTTER_SIZE + 12];
    }
    return [0, (weekIndex + 1) * squareSizeWithGutter - 2];
  };

  /**
   * Render a single day square
   */
  const renderSquare = (dayIndex: number, index: number) => {
    const isOutOfRange =
      index < numEmptyDaysAtStart || index >= numEmptyDaysAtStart + numDays;

    if (isOutOfRange && !showOutOfRangeDays) {
      return null;
    }

    const [x, y] = getSquareCoordinates(dayIndex);
    const attrs = getAttrsForIndex(index);
    const title = getTitleForIndex(index);

    return (
      <Rect
        key={index}
        width={squareSize}
        height={squareSize}
        x={x + PADDING_LEFT}
        y={y}
        title={title ?? undefined}
        onPress={() => handleDayPress(index)}
        {...(attrs as Record<string, unknown>)}
      />
    );
  };

  /**
   * Render all squares for a week
   */
  const renderWeek = (weekIndex: number) => {
    const [x, y] = getTransformForWeek(weekIndex);

    return (
      <G key={weekIndex} x={x} y={y}>
        {range(DAYS_IN_WEEK).map((dayIndex) =>
          renderSquare(dayIndex, weekIndex * DAYS_IN_WEEK + dayIndex),
        )}
      </G>
    );
  };

  /**
   * Render all weeks
   */
  const renderAllWeeks = () => {
    return range(weekCount).map((weekIndex) => renderWeek(weekIndex));
  };

  /**
   * Render month labels
   */
  const renderMonthLabels = () => {
    if (!showMonthLabels) return null;

    // Don't render label for last week (it would be cut off)
    return range(weekCount - 1).map((weekIndex) => {
      const endOfWeek = shiftDate(
        startDateWithEmptyDays,
        (weekIndex + 1) * DAYS_IN_WEEK,
      );

      // Only show label if we're at the start of a month (days 1-7)
      const dayOfMonth = endOfWeek.getDate();
      if (dayOfMonth < 1 || dayOfMonth > DAYS_IN_WEEK) {
        return null;
      }

      const [x, y] = getMonthLabelCoordinates(weekIndex);
      const monthIndex = endOfWeek.getMonth();
      const monthLabel = getMonthLabel
        ? getMonthLabel(monthIndex)
        : MONTH_LABELS[monthIndex];

      return (
        <Text
          key={`month-${weekIndex}`}
          x={x + PADDING_LEFT}
          y={y + 8}
          fontSize="10"
          fill="#999"
        >
          {monthLabel}
        </Text>
      );
    });
  };

  const weekWidth = DAYS_IN_WEEK * squareSizeWithGutter;
  const heatmapWidth = weekCount * squareSizeWithGutter - gutterSize;
  const heatmapHeight =
    weekWidth + (showMonthLabels ? MONTH_LABEL_GUTTER_SIZE + 12 : -gutterSize);

  return (
    <View style={style}>
      <Svg
        height={height}
        width={width}
        viewBox={
          horizontal ? `0 0 ${heatmapWidth} ${heatmapHeight}` : undefined
        }
      >
        <G>{renderMonthLabels()}</G>
        <G>{renderAllWeeks()}</G>
      </Svg>
    </View>
  );
}
