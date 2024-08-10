'use client';

import { useRouter } from 'next/navigation'; // Import useRouter hook
import SignInForm from './components/auth/SignInForm';
import SignUpForm from './components/auth/SignUpForm';
import { useState } from 'react';

const Page = () => {
  const router = useRouter();
  const [isSignInPage, setIsSignInPage] = useState(true);

  const handleSwitch = () => {
    setIsSignInPage(prev => !prev);
  };

  return (
    <div style={{ margin: 0 }}>
      {isSignInPage ? <SignInForm onSwitch={handleSwitch} /> : <SignUpForm onSwitch={handleSwitch} />}
    </div>
  );
};

export default Page;
