'use client';
import { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { keyframes } from '@emotion/react';
import { auth, googleProvider, facebookProvider } from '../firebase';
import { useRouter } from 'next/navigation';
import { Box, Button, TextField, Typography, Grid, Paper, Link } from '@mui/material';
import { styled } from '@mui/system';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';

const slideIn = keyframes`
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const Overlay = styled('div')`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(3px);
  z-index: 1;
`;

const OverlayTextTop = styled('div')`
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  color: #F5DEB3; 
  text-align: center;
  animation: ${slideIn} 1s ease-out;
  z-index: 2;
`;

const OverlayTextBottom = styled('div')`
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  color: #F5DEB3; 
  text-align: center;
  animation: ${slideIn} 1s ease-out;
  z-index: 2;
  font-size: 1.2rem; 
  font-weight: bold; 
`;

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

 

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setError(''); 
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/signin'); 
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already registered');
      } else {
        setError('Failed to sign up. Please try again.');
      }
    }
  };

  const handleSocialSignUp = async (provider) => {
    try {
      await signInWithPopup(auth, provider);
      router.push('/home'); 
    } catch (err) {
      setError('Failed to sign up with social provider. Please try again.');
    }
  };

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          position: 'relative',
          backgroundImage: 'url(/images/hero.png)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Overlay />
        <OverlayTextTop>
          <Typography variant="h2">
            <RestaurantMenuIcon fontSize="large" /> Welcome to PantryPal
          </Typography>
        </OverlayTextTop>
        <OverlayTextBottom>
          <Typography variant="h4">Track, manage, and optimize your pantry with ease.</Typography>
          <Typography variant="h6">Never run out of essentials and reduce food waste.</Typography>
        </OverlayTextBottom>
      </Grid>
      
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <Box component="form" noValidate onSubmit={handleEmailSignUp} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <Typography color="error">{error}</Typography>}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up with Email
            </Button>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 1, mb: 1 }}
              startIcon={<GoogleIcon />}
              onClick={() => handleSocialSignUp(googleProvider)}
            >
              Sign Up with Google
            </Button>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 1, mb: 1 }}
              startIcon={<FacebookIcon />}
              onClick={() => handleSocialSignUp(facebookProvider)}
            >
              Sign Up with Facebook
            </Button>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Already registered?{' '}
              <Link href="/signin" variant="body2">
                Login here
              </Link>
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default SignUp;