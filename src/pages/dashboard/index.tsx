import { NextPage } from 'next';
import React from 'react';
import Calendar from 'src/client/components/Calendar/Calendar';
import UserInfo from 'src/client/components/UserInfo/UserInfo';
import { Shift, User } from 'src/shared/shared-types';

interface DashboardPageProps {
  user: User;
  shifts: Shift[];
}

const DashboardPage: NextPage<DashboardPageProps> = ({ user, shifts }) => {
  return (
    <div>
      <UserInfo user={user} />
      <Calendar date={new Date()} />
      <div>
        {shifts.map((shift) => {
          return <div>{`${shift.name}: ${shift.start} - ${shift.end}`}</div>;
        })}
      </div>
    </div>
  );
};

export const getServerSideProps = async (context) => {
  const { user, shifts } = context.query;

  console.log('GSSR:', context.query);

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
      shifts,
    },
  };
};

export default DashboardPage;
