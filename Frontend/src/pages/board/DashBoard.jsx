import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

    useEffect(() => {
      const storedUsername = localStorage.getItem('username');

      if (storedUsername) {
        setUsername(storedUsername);
      } else {
        navigate('/sign-in');
      }
    }, 
    [navigate]
  );

  const handleLogout = () => {
    localStorage.removeItem('isRegistered');
    localStorage.removeItem('username');
    navigate('/sign-in');
  };

  return (
    <div className="dashboard-container container">
      <div className="dashboard-content container">
        <h1 className="dashboard-title h1">Welcome, {username}!</h1>
      </div>
    </div>
  );
};

export default Dashboard;