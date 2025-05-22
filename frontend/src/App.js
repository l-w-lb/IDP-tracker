import logo from './logo.svg';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Form from './pages/form.js'
import Login from './pages/login.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
