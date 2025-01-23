import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // To display error messages
  const navigate = useNavigate();  // Hook for navigation after successful login

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/login/", {
        email,
        password,
      });
      console.log(response.data);

      // Save the token to localStorage
      localStorage.setItem("token", response.data.token);

      // Trigger custom event to notify other components
      window.dispatchEvent(new Event("login"));

      // Redirect to home page (or dashboard) after successful login
      navigate("/home");
    } catch (error) {
      console.error(error.response?.data || error.message);
      setErrorMessage("Invalid email or password. Please try again."); // Set error message to be displayed
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>} {/* Display error message */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
      <p style={{ textAlign: "center" }}>
        <a href="/forgot-password">Forgot Password?</a>
      </p>
    </form>

  );
};

export default Login;
