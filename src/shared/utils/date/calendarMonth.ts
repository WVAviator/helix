/**
 * Get the plain text name of the month for use in headers or otherwise.
 * @param date the date from which the month name is to be retrieved
 * @returns a string representing the month name
 */
export const getMonthName = (date: Date): string => {
  return date.toLocaleString('default', { month: 'long' });
};

/**
 * Returns the full name of the weekday for the given date.
 * @param date the date from which the weekday is to be retrieved
 * @returns
 */
export const getWeekdayName = (date: Date): string => {
  return date.toLocaleString('default', { weekday: 'long' });
};

/**
 * Converts a numeric weekday into a string weekday.
 * @param weekday a number representing the weekday (0 = Sunday, 1 = Monday, etc.)
 * @returns
 */
export const convertWeekday = (weekday: number): string => {
  return {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
  }[weekday];
};

const getFirstWeekdayOfMonth = (date: Date): number => {
  return getFirstDateOfMonth(date).getDay();
};

const getFirstDateOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const getLastDateOfMonth = (date: Date): Date => {
  const lastDateOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return lastDateOfMonth;
};

const getMonthLength = (date: Date): number => {
  return getLastDateOfMonth(date).getDate();
};

//get the days remaining in a week after a weekday
const getDaysRemainingInWeek = (date: Date): number => {
  return 7 - date.getDay() - 1;
};

const getFirstDayOfWeek = (date: Date): Date => {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - date.getDay(),
  );
};

const getLastDayOfWeek = (date: Date): Date => {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - date.getDay() + 6,
  );
};

const getDaysBetween = (date1: Date, date2: Date): number => {
  return Math.round(
    Math.abs(date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24),
  );
};

export const getWeeksInCalendarMonth = (date: Date): number => {
  const firstDay = getFirstDayOfWeek(getFirstDateOfMonth(date));
  const lastDay = getLastDayOfWeek(getLastDateOfMonth(date));
  return Math.ceil(getDaysBetween(firstDay, lastDay) / 7);
};

/**
 * Builds an integer array representing a calendar month to be mapped into a calendar representation. Includes leading and trailing zeroes for unused weekdays.
 * @param date the date from which the calendar month is to be retrieved
 * @returns an integer array representing the calendar month with leading and trailing zeroes for empty days on a calendar
 */
export const getCalendarMonthDays = (date: Date): number[] => {
  const firstDayOfMonth = getFirstWeekdayOfMonth(date);
  const monthLength = getMonthLength(date);
  const days = [];

  //add zeroes for each weekday before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(0);
  }

  //add the days of the month
  for (let i = 1; i <= monthLength; i++) {
    days.push(i);
  }

  //add trailing zeroes for each weekday after the last day of the month
  for (let i = 0; i < getDaysRemainingInWeek(getLastDateOfMonth(date)); i++) {
    days.push(0);
  }
  return days;
};
