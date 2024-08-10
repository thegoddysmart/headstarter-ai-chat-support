'use client';

import { useRouter } from 'next/navigation';
import { Box, Button, Typography, Grid, Paper } from '@mui/material';
import { styled } from '@mui/system';

const Container = styled(Grid)`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
`;

const MainContent = styled(Paper)`
  padding: 20px;
  text-align: center;
  width: 100%;
  max-width: 400px;
`;

const HomePage = () => {
  const router = useRouter();

  const navigateToSignIn = () => {
    router.push('/auth/signin');
  };

  const navigateToSignUp = () => {
    router.push('/auth/signup');
  };

  return (
    <Container container component="main">
      <MainContent elevation={6} square>
        <Typography component="h1" variant="h4" gutterBottom>
          Welcome to AI Customer Support
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Manage your customer interactions effortlessly with our AI-driven solutions.
        </Typography>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={navigateToSignIn}
          sx={{ mb: 1 }}
        >
          Log In
        </Button>
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          onClick={navigateToSignUp}
        >
          Sign Up
        </Button>
      </MainContent>
    </Container>
  );
};

export default HomePage;
