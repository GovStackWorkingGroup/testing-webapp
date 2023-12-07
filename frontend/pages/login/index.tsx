import { useState } from 'react';
import useTranslations from '../../hooks/useTranslation';
import Button from '../../components/shared/buttons/Button';

const MyLogin = () => {
  const { format } = useTranslations();

  const handleLogin = () => {
    // Redirect to your backend's GitHub auth endpoint
    // on stagging it must be a host name not "localhost"
    window.location.href = 'http://localhost:5000/auth/github';
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
