  function formatLocalDate(d: Date) {
    const year = d.getFullYear();
    // January is 0, so we have to add 1
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  
  
export function getTodayDateString(): string {
  const today = new Date();
  return formatLocalDate(today)
}

// weekly helper function
export function getWeekBounds(date: Date): { start: string; end: string } {
  const dayOfWeek = date.getDay();

  // calculate monday of this week (start)
  const monday = new Date(date);
  monday.setDate(date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));

  // calculate sunday of this week (end)
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    start: formatLocalDate(monday),
    end: formatLocalDate(sunday),
  };
}

// monthly helper function
export function getMonthBounds(date: Date): { start: string; end: string } {
  // first day of the month (start)
  const first = new Date(date);
  first.setDate(1);

  // last day of the month (end)
  const last = new Date(first);
  last.setMonth(last.getMonth() + 1); // must set it to the next month because
  last.setDate(0); // 0 will take the last date of the previous month

  return {
    start: formatLocalDate(first),
    end: formatLocalDate(last),
  };
}

export function getWeekMonthBounds(date: Date) {
  const { start: weekStart, end: weekEnd } = getWeekBounds(date);
  const { start: monthStart, end: monthEnd } = getMonthBounds(date);
  return { weekStart, weekEnd, monthStart, monthEnd };
}

/**
 * Start date should be the closest monday 365 days ago
 * End date should be today
 * @param date
 * @returns start and end dates
 */
export function getYearBounds(date: Date): { start: string; end: string } {
  // calculate date 365 days ago
  const startDate = new Date(date);
  startDate.setDate(date.getDate() - 365);

  // find the closest monday to 365 days ago
  const dayOfWeek = startDate.getDay();

  // calculate offset to previous monday
  // dayOfWeek: 0=Sunday, 1=Monday, 2=Tuesday, ..., 6=Saturday
  // to get to monday: if we're on monday (1), offset is 0
  // if we're on sunday (0), offset is -6 (go back to previous monday)
  // otherwise, offset is (dayOfWeek - 1) to go back to the previous monday
  const mondayOffset = dayOfWeek === 0 ? -6 : dayOfWeek - 1;

  startDate.setDate(startDate.getDate() - mondayOffset);

  return {
    start: startDate.toISOString().split("T")[0],
    end: date.toISOString().split("T")[0],
  };
}
