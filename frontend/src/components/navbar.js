import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useUser } from '../context/userContext.js';

import '../styles/navbar.css'

import { checkLogin, logout } from '../services/authServices';

function Navbar() {
  const [username, setUsername] = useState('');
  const { user } = useUser();
  console.log('user',user)
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await checkLogin();
        console.log('auth',res)

        if (res.loggedIn) {
          setUsername(res.username);
        } else {
          navigate('/')
        }

      } catch (err) {
        console.error('Session error:', err);
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-left">{username}</div>
        <div className="navbar-right" onClick={handleLogout} style={{ cursor: 'pointer' }}>Log out</div>
      </nav>
    </div>
    
  );
}

export default Navbar;