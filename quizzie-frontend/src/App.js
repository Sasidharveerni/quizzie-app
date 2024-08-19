import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginSignup from './components/LoginSignup'
import './App.css';
import DashBoard from './components/DashBoard';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <>
    <ToastContainer />
      <BrowserRouter>
         <Routes>
           <Route path='/' element={<LoginSignup />} />
           <Route path='/dashboard' element={<DashBoard />} />
          </Routes>
      </BrowserRouter>
   
    </>
  );
}

export default App;
