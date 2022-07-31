/** @jsxImportSource @emotion/react */
import React from 'react';
import useLoginFormStyles from './LoginForm.css';
import { Button, TextField, Alert } from '@mui/material';
import { useRouter } from 'next/router';
import { fetch } from 'src/shared/utils/fetch';

interface LoginFormProps {
  headerText: string;
}

const apiRoute = 'http://localhost:4000';

const LoginForm: React.FC<LoginFormProps> = ({ headerText }) => {
  const router = useRouter();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [unauthorized, setUnauthorized] = React.useState(false);

  const { outerDivStyle, baseFormStyle, errorStyle } = useLoginFormStyles();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(
      `Submitting login form with email: ${email} and password: ${password}`,
    );
    const response = await fetch(`/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    console.log('Response: ', response);

    if (response.status === 201) {
      window.location.href = router.basePath + '/dashboard';
      return;
    }

    setUnauthorized(true);
  };

  return (
    <div css={outerDivStyle}>
      <h1>{headerText}</h1>
      <form css={baseFormStyle} action="submit" onSubmit={handleSubmit}>
        <TextField
          required
          id="email-entry"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          required
          id="password-entry"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div css={errorStyle}>
          {unauthorized && (
            <Alert severity="error" variant="filled">
              Incorrect email or password.
            </Alert>
          )}
        </div>

        <Button variant="contained" type="submit">
          Login
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
