import { GetServerSideProps } from 'next';
import React from 'react';
import UserInfo from 'src/client/components/UserInfo/UserInfo';
import { User } from 'src/shared/shared-types';

interface ManagementDashboardProps {
  user: User;
  allUsers: User[];
}

const ManagementDashboard: React.FC<ManagementDashboardProps> = ({ user }) => {
  return (
    <div>
      <UserInfo user={user} />
      ManagementDashboard
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      user: context.query.user,
      allUsers: context.query.allUsers,
    },
  };
};

export default ManagementDashboard;
