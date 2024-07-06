import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login/Login'
import Dashboard from './components/dashboard/Dashboard';
import Leaderboard from './components/leaderboard/Leaderboard';
import Question_Menu from './components/question_menu/Question_Menu';
import Signup from './components/signup/Signup';
import Logout from './components/logout/Logout'
import Navbar from './components/navbar/Navbar';
import './styles/app.css'


function App() {
  return (

    <Router>
        <div className='app-container'>
            <Navbar  />
            <div className='box-background'>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/logout" element={<Logout />} />
                    {/* NOTE: TEMP UNTIL WE GET AUTHENTICATION UP */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    {/* <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} /> */}
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/questions" element={<Question_Menu />} />
                </Routes>
            </div>
        </div>
    </Router>
  )
}

export default App
