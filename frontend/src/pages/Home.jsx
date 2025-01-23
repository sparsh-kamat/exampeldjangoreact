import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // For redirecting to login if not authenticated

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user has a valid token in localStorage
    const token = localStorage.getItem("token");

    if (token) {
      setIsAuthenticated(true);
    } else {
      // Redirect to login if no token is found
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const handleLogoutMessage = () => {
      setLogoutMessage("Successfully logged out");
      setLoginMessage(""); // Clear login message
      setIsAuthenticated(false); // Set isAuthenticated to false
      // Redirect to login page after logout after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    };
    const handleLoginMessage = () => {
      setLoginMessage("Welcome, you're logged in");
      setLogoutMessage(""); // Clear logout message
    };
    window.addEventListener("logout", handleLogoutMessage);
    window.addEventListener("login", handleLoginMessage);
    return () => {
      window.removeEventListener("logout", handleLogoutMessage);
      window.removeEventListener("login", handleLoginMessage);
    };
  }, [navigate]);

  return (
    <div>
      <h1>Home Page</h1>
      {loginMessage && <p>{loginMessage}</p>}
      {logoutMessage && <p>{logoutMessage}</p>}
      {isAuthenticated ? (
        <h2>Welcome, youre logged in!</h2>
      ) : (
        <h2>Redirecting to login...</h2>
      )}
    </div>
  );
};

export default Home;
