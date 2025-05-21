import logo from './logo.svg';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Form from './pages/form.js'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Form />} />
        {/* <Route path="/form/:id" element={<FormViewer />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
