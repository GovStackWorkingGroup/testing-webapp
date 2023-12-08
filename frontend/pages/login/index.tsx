import { useState } from 'react';
import useTranslations from '../../hooks/useTranslation';
import Button from '../../components/shared/buttons/Button';

const MyLogin = () => {
  const { format } = useTranslations();

  const handleLogin = () => {
    // Directly use process.env.API_URL as set in your Next.js config
    const apiUrl = process.env.API_URL;
    window.location.href = `${apiUrl}/auth/github`;
  };

  return (
    <div>
      <Button
        onClick={handleLogin}
        text={format('app.login_with_github.label')}
        type="button"
        styles="primary-button"
      />
    </div>
  );
};

export default MyLogin;
