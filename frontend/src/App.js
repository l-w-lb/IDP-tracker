import logo from './logo.svg';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import LayoutWrapper from './LayoutWrapper.js';

import { UserProvider } from './context/userContext.js';
import { FormProvider } from './context/FormContext.js';

import './App.css';

function App() {
  return (
    
    <BrowserRouter>
      <UserProvider>
        <FormProvider>
          <LayoutWrapper />
        </FormProvider>
      </UserProvider>
    </BrowserRouter>
    
  );
}

export default App;
