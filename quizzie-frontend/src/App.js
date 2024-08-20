/* eslint-disable react-hooks/exhaustive-deps */
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginSignup from './components/LoginSignup'
import './App.css';
import DashBoard from './components/DashBoard';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import { useEffect, useState } from 'react';

function App() {
  const email = localStorage.getItem('quizzieEmail') || '';
  const token = localStorage.getItem('quizzieToken') || '';

  console.log(email, token);

  const [isLogin, setIsLogin] = useState(false);
  const [creatorData, setCreatorData] = useState(null);

  
  const checkUserLoginStatus = async () => {
    try {
      console.log(email)
      if (email !== '' && token !== '') {
        const response = await axios.post('http://localhost:5000/login/status', {email} , {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data.status === 'Success') {
          console.log(response.data.user);
          localStorage.setItem('quizzieCreatorId', response.data.user._id)
          setCreatorData(response.data.user);
          setIsLogin(true);
        }
      } else {
        setIsLogin(false);
        setCreatorData(null);
      }
    } catch (error) {
      console.log(error);
      setIsLogin(false);
    }
  };

  useEffect(() => {
    checkUserLoginStatus();
  }, [])


  return (
    <>
    <ToastContainer />
      <BrowserRouter>
         <Routes>
           <Route path='/' element={<LoginSignup setCreatorData={setCreatorData}/>} />
           <Route path='/dashboard' element={<DashBoard creatorData={creatorData} />} />
          </Routes>
      </BrowserRouter>
   
    </>
  );
}

export default App;
