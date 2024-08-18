import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginSignup from './components/LoginSignup';
import './App.css';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginSignup />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
