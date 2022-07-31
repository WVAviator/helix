import { useMemo } from 'react';
import { css } from '@emotion/react';

const useLoginFormStyles = () => {
  const baseFormStyle = useMemo(() => {
    return css`
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2rem;
      width: 25rem;
      & > * {
        width: 100%;
        height: 3rem;
      }
    `;
  }, []);

  const outerDivStyle = useMemo(() => {
    return css`
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100vw;
      height: 75vh;
      gap: 1.5rem;
    `;
  }, []);

  const errorStyle = useMemo(() => {
    return css`
      width: 100%;
      height: 3rem;
    `;
  }, []);

  return { outerDivStyle, baseFormStyle, errorStyle };
};

export default useLoginFormStyles;
