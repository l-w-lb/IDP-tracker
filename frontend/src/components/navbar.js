import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useUser } from '../context/userContext.js';

import '../styles/navbar.css'

import { logout } from '../services/authServices';

function Navbar() {
  const { user } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-left">
          {user?.username ?? 'ไม่พบชื่อผู้ใช้'}
        </div>
        <div className="navbar-right" onClick={handleLogout} style={{ cursor: 'pointer' }}>
          Log out
        </div>
      </nav>
    </div>
  );
}

export default Navbar;