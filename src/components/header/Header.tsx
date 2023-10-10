import { useRouter } from 'next/router';
import React from 'react';
import '../../public/images/logo.png';

const Header = () => {
  const router = useRouter();

  const handleBackToHomePage = () => {
    router.push('/');
  };

  return (
    <div className='header'>
      <div className='header-logo' onClick={handleBackToHomePage} data-testid='logo'>
        <img src='/images/logo.png' alt='logo' />
      </div>
    </div>
  );
};

export default Header;
