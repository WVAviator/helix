import {
  convertWeekday,
  getCalendarMonthDays,
  getMonthName,
  getWeekdayName,
  getWeeksInCalendarMonth,
} from './calendarMonth';

describe('calendarMonth', () => {
  it('should return a full calendar month as an array with leading and trailing zeroes 1', () => {
    const testDate = new Date(2022, 7, 1); //August 1, 2022
    const expected = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 0, 0, 0,
    ];
    const actual = getCalendarMonthDays(testDate);
    expect(actual).toEqual(expected);
  });
  it('should return a full calendar month as an array with leading and trailing zeroes 2', () => {
    const testDate = new Date(2022, 3, 1); //April 1, 2022
    const expected = [
      0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
      18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
    ];
    const actual = getCalendarMonthDays(testDate);
    expect(actual).toEqual(expected);
  });
  it('should return a full calendar month as an array with leading and trailing zeroes 3', () => {
    const testDate = new Date(2022, 0, 19); //January 19, 2022
    const expected = [
      0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
      17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 0, 0, 0, 0, 0,
    ];
    const actual = getCalendarMonthDays(testDate);
    expect(actual).toEqual(expected);
  });
  it('should return the correct month name', () => {
    const testDate = new Date(2022, 7, 1); //August 1, 2022
    const expected = 'August';
    const actual = getMonthName(testDate);
    expect(actual).toEqual(expected);
  });
  it('should return the correct number of weeks in a month', () => {
    const testDate = new Date(2022, 7, 1); //August 1, 2022
    const expected = 5;
    const actual = getWeeksInCalendarMonth(testDate);
    expect(actual).toEqual(expected);
  });
  it('should return the correct number of weeks in a month 2', () => {
    const testDate = new Date(2022, 1, 1); //February 1, 2022
    const expected = 5;
    const actual = getWeeksInCalendarMonth(testDate);
    expect(actual).toEqual(expected);
  });
  it('should return the correct weekday name', () => {
    const testDate = new Date(2022, 7, 1); //August 1, 2022
    const expected = 'Monday';
    const actual = getWeekdayName(testDate);
    expect(actual).toEqual(expected);
  });
  it('should return the correct conversion of weekday number to string day', () => {
    const testDate = 2; //Tuesday
    const expected = 'Tuesday';
    const actual = convertWeekday(testDate);
    expect(actual).toEqual(expected);
  });
});
