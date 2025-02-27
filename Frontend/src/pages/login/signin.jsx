import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleSignIn = () => {
    localStorage.setItem('username', username);
    localStorage.setItem('isRegistered', 'true');
    navigate('/');
  };

  return (
    <div>
      <h1>Sign In</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <FieldButton buttonName="Sign In"/>
      <p>
        Don't have an account? <Link to="/sign-up">Sign Up</Link>
      </p>
    </div>
  );
};

export default SignIn;