import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();  // Initialize navigate for redirect

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!otpSent) {
      try {
        const response = await axios.post("http://localhost:8000/api/signup/", {
          email,
          password,
        });
        console.log(response.data);
        setOtpSent(true); // Set otpSent to true to show OTP input
      } catch (error) {
        console.error(error.response?.data || error.message);
      }
    } else {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/verify-otp/",
          { email, otp, password }
        );
        console.log(response.data);

        // On successful OTP verification, redirect to login page
        navigate("/login");  // Redirect to the login page after OTP verification
      } catch (error) {
        console.error(error.response?.data || error.message);
      }
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <h2>Signup</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      {!otpSent ? (
        <>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Send OTP</button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button type="submit">Verify OTP</button>
        </>
      )}
    </form>
  );
};

export default Signup;
