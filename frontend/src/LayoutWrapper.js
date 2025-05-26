import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useUser } from './context/userContext.js';

import './App.css';

import Navbar from './components/navbar.js'
import Form from './pages/form.js'
import Login from './pages/login.js';
import FormList from './pages/formList.js';
import ApprovalList from './pages/approvalList.js';

function LayoutWrapper() {
  const location = useLocation();
  const { setUser } = useUser();

  const hideNavbarOn = ['/'];
  const shouldHideNavbar = hideNavbarOn.includes(location.pathname);

  
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/form/:id/:formTitle" element={<Form />} />
        <Route path="/formList" element={<FormList />} />

        <Route path="/approvalList" element={<ApprovalList />} />
      </Routes>
    </>
  );
}

export default LayoutWrapper;