import { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!otpSent) {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/forgot-password/",
          { email }
        );
        console.log(response.data);
        setOtpSent(true);
      } catch (error) {
        console.error(error.response?.data || error.message);
      }
    } else {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/reset-password/",
          { email, otp, password: newPassword }
        );
        console.log(response.data);
      } catch (error) {
        console.error(error.response?.data || error.message);
      }
    }
  };

  return (
    <form onSubmit={handleForgotPassword}>
      <h2>Forgot Password</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      {otpSent && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </>
      )}
      <button type="submit">{otpSent ? "Reset Password" : "Send OTP"}</button>
    </form>
  );
};

export default ForgotPassword;
