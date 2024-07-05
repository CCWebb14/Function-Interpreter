import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/global.css'
import Dashboard from './components/dashboard/Dashboard';
import Leaderboard from './components/leaderboard/Leaderboard';
import Question_Menu from './components/question_menu/Question_Menu';
import Signup from './components/signup/Signup';
import Landing from './components/landing/Landing';
import FourOhFour from './components/404notfound/notfound';
function App() {


  return (
    // <div className="app-container">
    //   <div className="navbar">
    //     <h1>Navbar</h1>
    //   </div>
    //   <div className="login-container">
    //     <Login/>
    //   </div>
    // </div>
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        {/* NOTE: TEMP UNTIL WE GET AUTHENTICATION UP */}
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} /> */}
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/questions" element={<Question_Menu />} />
        <Route path="*" element={<FourOhFour />} /> {/* Catch-all route for 404 Not Found */}
      </Routes>
    </Router>
  )
}

export default App
