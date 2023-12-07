import { useState } from 'react';

const MyLogin = () => {

  const handleLogin = () => {
    // Redirect to your backend's GitHub auth endpoint
    // on stagging it must be a host name not "localhost"
    window.location.href = 'http://localhost:5000/auth/github';
  };

  return (
    <div>
      <button onClick={handleLogin}>
        Login with GitHub
      </button>
    </div>
  );
};

export default MyLogin;
