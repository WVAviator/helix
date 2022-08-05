import { NextPage } from 'next';
import React from 'react';
import Calendar from 'src/client/components/Calendar/Calendar';
import { User } from 'src/shared/shared-types';

interface DashboardPageProps {
  user: User;
}

const DashboardPage: NextPage<DashboardPageProps> = ({ user }) => {
  return (
    <div>
      Dashboard for {user.firstName} {user.lastName}
      <Calendar date={new Date(2022, 6, 19)} />
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
