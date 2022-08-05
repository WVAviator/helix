/** @jsxImportSource @emotion/react */
import React from 'react';
import {
  convertWeekday,
  getCalendarMonthDays,
  getMonthName,
  getWeeksInCalendarMonth,
} from 'src/shared/utils/date/calendarMonth';
import useCalendarStyles from './Calendar.css';

interface CalendarProps {
  date: Date;
}

const Calendar: React.FC<CalendarProps> = ({ date }) => {
  const month = getMonthName(date);
  const calendarDays = getCalendarMonthDays(date);

  const { dateStyles, weekStyles, tableStyles } = useCalendarStyles();

  const calendar = Array(getWeeksInCalendarMonth(date))
    .fill(0)
    .map((_, i) => {
      const week = calendarDays.slice(i * 7, i * 7 + 7);
      return (
        <tr key={i} css={weekStyles}>
          {week.map((day, j) => {
            return (
              <td key={`${i}:${j}`} css={dateStyles}>
                {day === 0 ? <div></div> : <div>{day}</div>}
              </td>
            );
          })}
        </tr>
      );
    });

  return (
    <>
      <h1>{month}</h1>
      <table css={tableStyles}>
        <thead>
          <tr css={weekStyles}>
            {Array(7)
              .fill(0)
              .map((_, i) => {
                return (
                  <td key={i} css={dateStyles}>
                    {convertWeekday(i)}
                  </td>
                );
              })}
          </tr>
        </thead>
        <tbody>{calendar}</tbody>
      </table>
    </>
  );
};

export default Calendar;
