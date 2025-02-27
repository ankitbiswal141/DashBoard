import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DashBoard.css';
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
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isRegistered');
    localStorage.removeItem('username');
    navigate('/sign-in');
  };

  return (
    <div>
      <nav className="navbar">
        <div className="logo">
          <img src="logo.svg" alt="Logo" />
        </div>
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#solutions">Solutions</a></li>
          <li><a href="#products">Products</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#contact">Contact Us</a></li>
          <li><FieldButton buttonName="Logout"/></li>
          <li><FieldButton buttonName="Join"/></li>
        </ul>
      </nav>
      <div className="content">
        <h1>Welcome, {username}!</h1>
        <p>This is your participant's dashboard.</p>
        <div className="dashboard-sections">
          <div className="section">
            <h2>Profile</h2>
            <p>View and edit your profile information.</p>
          </div>
          <div className="section">
            <h2>Events</h2>
            <p>View upcoming events and register for them.</p>
          </div>
          <div className="section">
            <h2>Messages</h2>
            <p>Check your messages from other participants and organizers.</p>
          </div>
          <div className="section">
            <h2>Resources</h2>
            <p>Access useful resources and documents.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;