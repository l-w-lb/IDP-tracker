import logo from './logo.svg';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import './App.css';

import Navbar from './components/navbar.js'
import Form from './pages/form.js'
import Login from './pages/login.js';
import FormList from './pages/formList.js';
import ApprovalList from './pages/approvalList.js';

function LayoutWrapper() {
  const location = useLocation();

  const hideNavbarOn = ['/']; // ✅ path ที่ไม่ต้องแสดง Navbar

  const shouldHideNavbar = hideNavbarOn.includes(location.pathname);

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

function App() {
  return (
    <BrowserRouter>
      <LayoutWrapper />
    </BrowserRouter>
  );
}

export default App;
