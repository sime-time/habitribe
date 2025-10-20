export function getTodayDateString(): string {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1; // January is 0, so we have to add 1
  const year = today.getFullYear();

  // format today's date to YYYY-MM-DD
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

// weekly helper function
export function getWeekBounds(date: string): { start: string; end: string } {
  const d = new Date(date);
  const dayOfWeek = d.getDay();

  // calculate monday of this week (start)
  const monday = new Date(d);
  monday.setDate(d.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));

  // calculate sunday of this week (end)
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    start: monday.toISOString().split("T")[0],
    end: sunday.toISOString().split("T")[0],
  };
}

// monthly helper function
export function getMonthBounds(date: string): { start: string; end: string } {
  const d = new Date(date);

  // first day of the month (start)
  const first = new Date(d);
  first.setDate(1);

  // last day of the month (end)
  const last = new Date(first);
  last.setMonth(last.getMonth() + 1); // must set it to the next month because
  last.setDate(0); // 0 will take the last date of the previous month

  return {
    start: first.toISOString().split("T")[0],
    end: last.toISOString().split("T")[0],
  };
}
