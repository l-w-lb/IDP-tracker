import logo from './logo.svg';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { UserProvider } from './context/userContext.js';
import LayoutWrapper from './LayoutWrapper.js';

import './App.css';

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <LayoutWrapper />
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
