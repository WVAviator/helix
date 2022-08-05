import { GetServerSideProps } from 'next';
import React from 'react';
import LoginForm from 'src/client/components/LoginForm/LoginForm';
import { User } from 'src/shared/shared-types';

const Login = () => {
  return (
    <div>
      <LoginForm headerText="Helix Scheduling" />
    </div>
  );
};

export default Login;
