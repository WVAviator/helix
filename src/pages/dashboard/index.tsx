import { NextPage } from 'next';
import React from 'react';
import { User } from 'src/shared/shared-types';

interface DashboardPageProps {
  user: User;
}

const DashboardPage: NextPage<DashboardPageProps> = ({ user }) => {
  return (
    <div>
      Dashboard for {user.firstName} {user.lastName}
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
