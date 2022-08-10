import { css } from '@emotion/react';
import { useMemo } from 'react';

const useUserInfoStyles = () => {
  const badgeStyles = useMemo(() => {
    return css``;
  }, []);

  const usernameStyles = useMemo(() => {
    return css`
      font-size: 1.1rem;
    `;
  }, []);

  const logoutStyles = useMemo(() => {
    return css`
      text-decoration: underline;
      cursor: pointer;
    `;
  }, []);

  const baseStyles = useMemo(() => {
    return css`
      position: fixed;
      top: 1rem;
      right: 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
    `;
  }, []);

  return {
    badgeStyles,
    usernameStyles,
    logoutStyles,
    baseStyles,
  };
};

export default useUserInfoStyles;
