import { Routes, Route, useLocation,useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useUser } from './context/userContext.js';

import { checkLogin } from './services/authServices.js';

import './App.css';

import Navbar from './components/navbar.js'
import Form from './pages/form.js'
import Login from './pages/login.js';
import FormList from './pages/formList.js';
import ApprovalList from './pages/approvalList.js';
import PDFEditor from './components/pdfEditor.js';
import PDFEditorUser from './components/pdfEditorUser.js';

function LayoutWrapper() {
  const location = useLocation();
  const { setUser } = useUser();
  const navigate = useNavigate();

  const hideNavbarOn = ['/'];
  const shouldHideNavbar = hideNavbarOn.includes(location.pathname);
  // const hideNavbarOn = ['/', '/pdfPreviewer'];

  // const shouldHideNavbar = () => {
  //   if (location.pathname === '/') return true;
  //   if (location.pathname.startsWith('/pdfPreviewer')) return true;
  //   return false;
  // };

  
  useEffect(() => {
      const fetchUser = async () => {
        try {
          const res = await checkLogin();
          console.log('auth',res)
  
          if (res.loggedIn) {
            setUser(res)
          } else {
            navigate('/')
          }
  
        } catch (err) {
          navigate('/')
          console.error('Session error:', err);
        }
      };
  
      fetchUser();
    }, []);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/form/:formTitle" element={<Form />} />
        <Route path="/formList" element={<FormList />} />

        <Route path="/approvalList" element={<ApprovalList />} />
        <Route path="/pdfEditor/:uploads/:folder/:pdfName" element={<PDFEditor />} />
        <Route path="/pdfEditorUser/:uploads/:folder/:pdfName" element={<PDFEditorUser />} />
      </Routes>
    </>
  );
}

export default LayoutWrapper;