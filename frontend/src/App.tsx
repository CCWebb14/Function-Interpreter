import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './components/login/Login';
import Dashboard from './components/dashboard/Dashboard';
import Leaderboard from './components/leaderboard/Leaderboard';
import Question_Menu from './components/question_menu/Question_Menu';
import Question from './components/question/Question';
import Signup from './components/signup/Signup';
import NotFound from './components/404/404';
import Navbar from './components/navbar/Navbar';
import Test_Suite from './components/tests/Tests';
import './styles/app.css';

const App: React.FC = () => {
  const location = useLocation();

  return (
    <div className='app-container'>
      {/* Temp fix to not render navbar on 404 and test*/}
      {location.pathname !== '/404' && location.pathname !== '/test' && <Navbar />}
      <div className='box-background'>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/questions" element={<Question_Menu />} />
          <Route path="/question/:id" element={<Question />} />
          <Route path="/test" element={<Test_Suite />} />
          <Route path="/404" element={<NotFound />} />

          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
