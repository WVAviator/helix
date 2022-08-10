/** @jsxImportSource @emotion/react */
import { useRouter } from 'next/router';
import React from 'react';
import { User } from 'src/shared/shared-types';
import useUserInfoStyles from './UserInfo.css';

interface UserInfoProps {
  user: User;
}

const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
  const { badgeStyles, usernameStyles, logoutStyles, baseStyles } =
    useUserInfoStyles();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/auth/logout', {
      method: 'POST',
    });
    router.push('/login');
  };

  return (
    <div css={baseStyles}>
      <div css={badgeStyles} id="badge"></div>
      <div
        css={usernameStyles}
        id="user-name"
      >{`${user.firstName} ${user.lastName}`}</div>
      <div css={logoutStyles} id="logout" onClick={handleLogout}>
        <a>Logout</a>
      </div>
    </div>
  );
};

export default UserInfo;
