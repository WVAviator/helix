import { NextPage } from 'next';
import React from 'react';
import Calendar from 'src/client/components/Calendar/Calendar';
import UserInfo from 'src/client/components/UserInfo/UserInfo';
import { User } from 'src/shared/shared-types';

interface DashboardPageProps {
  user: User;
}

const DashboardPage: NextPage<DashboardPageProps> = ({ user }) => {
  return (
    <div>
      <UserInfo user={user} />
      <Calendar date={new Date()} />
    </div>
  );
};

export const getServerSideProps = async (ctx) => {
  const user: User = ctx.query;
  console.log('GSSR: ', user);
  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  return {
    props: {
      user,
    },
  };
};

export default DashboardPage;
