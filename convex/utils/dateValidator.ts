export interface DateValidation {
  isValid: boolean;
  error?: string;
}

/**
 * Validate YYYY-MM-DD format only
 * Does NOT check date bounds (timezone issues: server UTC vs client local)
 *
 * Timezone-aware validation (future/past checks) must happen on CLIENT
 * Backend only validates format and when enforcing "same day only" rules
 */
export function validateDate(dateString: string): DateValidation {
  // validate YYYY-MM-DD format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return { isValid: false, error: `Invalid date format: ${dateString}` };
  }

  // check it's a valid date (not 2025-02-30)
  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) {
    return { isValid: false, error: `Invalid date value: ${dateString}` };
  }

  return { isValid: true };
}
