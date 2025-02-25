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
    <>
        <div class="container px-4 text-center">
          <div class="row gx-5">
            <div class="col">
              <div class="p-3">Custom column padding</div>
      </div>
        <div class="col">
          <div class="p-3">Custom column padding</div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Dashboard;