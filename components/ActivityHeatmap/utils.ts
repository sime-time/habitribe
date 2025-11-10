/**
 * @fileoverview Utility functions for date manipulation and value calculations.
 * Handles date conversions, shifting, and opacity calculations for heatmap cells.
 */

import { MILLISECONDS_IN_ONE_DAY } from "./constants";

/**
 * Convert various date formats to a Date object.
 * @param obj - A Date object, ISO string, or millisecond timestamp
 * @returns A Date object
 */
export function convertToDate(obj: string | number | Date): Date {
  return obj instanceof Date ? obj : new Date(obj);
}

/**
 * Get the beginning of the day (00:00:00) for a given date.
 * Useful for consistent date comparisons.
 *
 * @param date - The input date
 * @returns A new Date object set to midnight of the input date
 */
export function getBeginningTimeForDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Shift a date forward or backward by a number of days.
 * @param date - The starting date
 * @param numDays - Number of days to shift (positive = forward, negative = backward)
 * @returns A new Date object shifted by the specified number of days
 */
export function shiftDate(date: Date, numDays: number): Date {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + numDays);
  return newDate;
}

/**
 * Map a value from one range to another.
 * Used to calculate opacity for heatmap cells based on their data values.
 *
 * @param value - The value to map
 * @param inMin - Minimum of input range
 * @param inMax - Maximum of input range
 * @param outMin - Minimum of output range (e.g., 0.2 for opacity)
 * @param outMax - Maximum of output range (e.g., 1.0 for opacity)
 * @returns The mapped value in the output range
 */
export function mapValue(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  // Avoid division by zero
  if (inMax === inMin) {
    return outMin;
  }

  // Linear interpolation formula: y = (x - in_min) / (in_max - in_min) * (out_max - out_min) + out_min
  return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}

/**
 * Generate an array of numbers from 0 to count (exclusive).
 * Replaces lodash _.range() with native JavaScript.
 *
 * @param count - The number of elements to generate
 * @returns Array of sequential numbers [0, 1, 2, ..., count-1]
 */
export function range(count: number): number[] {
  return Array.from({ length: count }, (_, i) => i);
}
