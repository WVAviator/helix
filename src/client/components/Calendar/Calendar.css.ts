import { useMemo } from 'react';
import { css } from '@emotion/react';
const useCalendarStyles = () => {
  const dateStyles = useMemo(() => {
    return css`
      width: 4rem;
      height: 4rem;
      border: 1px solid #000;
      display: inline-block;
      margin: 0;
      padding: 1rem;
    `;
  }, []);

  const weekStyles = useMemo(() => {
    return css`
      margin: 0;
    `;
  }, []);

  const tableStyles = useMemo(() => {
    return css`
      border-collapse: collapse;
    `;
  }, []);

  return { dateStyles, weekStyles, tableStyles };
};

export default useCalendarStyles;
