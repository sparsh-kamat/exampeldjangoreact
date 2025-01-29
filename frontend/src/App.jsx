import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home"; // Import the Home component
import axios from 'axios';
import DisasterList from './pages/DisasterList'; // Import the DisasterList component

axios.defaults.withCredentials = true;
axios.defaults.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/home" element={<Home />} /> {/* Add the Home route */}
        <Route path="/disasters" element={<DisasterList />} /> {/* Add the DisasterList route */}
      </Routes>
    </Router>
  );
};

export default App;
