'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '../../../firebase';
import { useRouter } from 'next/navigation';
import { Box, Button, TextField, Typography, Grid, Paper, Link } from '@mui/material';
import { styled } from '@mui/system';
import FacebookIcon from '@mui/icons-material/Facebook';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';

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
  color: #ffffff;
  text-align: center;
  z-index: 2;
`;

const OverlayTextBottom = styled('div')`
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  color: #ffffff;
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
  z-index: 2;
`;

const SignInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/home');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/home');
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.');
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      await signInWithPopup(auth, facebookProvider);
      router.push('/home');
    } catch (err) {
      setError('Failed to sign in with Facebook. Please try again.');
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
          backgroundImage: 'url(/images/signin.webp)',
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
            <HeadsetMicIcon fontSize="large" /> Welcome Back to AI Customer Support
          </Typography>
        </OverlayTextTop>
        <OverlayTextBottom>
          <Typography variant="h4">Streamline your support process with AI solutions.</Typography>
          <Typography variant="h6">Enhance customer satisfaction with intelligent automation.</Typography>
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
            color: '#ffffff',
          }}
        >
          <Typography component="h1" variant="h5" sx={{
            color: '#000'
          }}>
            Sign In
          </Typography>
          <Box component="form" noValidate onSubmit={handleEmailSignIn} sx={{ mt: 1 }}>
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
              sx={{ mt: 3, mb: 2, backgroundColor: '#000000', color: '#ffffff' }}
            >
              Sign In with Email
            </Button>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 1, mb: 1, backgroundColor: '#000000', color: '#ffffff' }}
              startIcon={<img src="/images/google.png" alt="Google" style={{ width: '24px' }} />}
              onClick={handleGoogleSignIn}
            >
              Sign In with Google
            </Button>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 1, mb: 1, backgroundColor: '#000000', color: '#ffffff' }}
              startIcon={<FacebookIcon sx={{ color: '#4267B2' }} />}
              onClick={handleFacebookSignIn}
            >
              Sign In with Facebook
            </Button>
            <Typography variant="body2" sx={{ mt: 2, color: '#000' }}>
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" variant="body2">
                Sign Up here
              </Link>
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default SignInForm;
