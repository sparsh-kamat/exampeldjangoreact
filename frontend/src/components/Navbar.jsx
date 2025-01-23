import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    const checkToken = () => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);
    };

    useEffect(() => {
        checkToken();
        const handleStorageChange = () => {
            checkToken();
        };
        window.addEventListener("storage", handleStorageChange);
        window.addEventListener("login", handleStorageChange); // Custom event listener
        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("login", handleStorageChange); // Remove custom event listener
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        window.dispatchEvent(new Event("logout")); // Trigger custom event
        navigate("/login");
    };

    return (
        <nav>
            <ul>
                <li>
                    <NavLink to="/home" activeClassName="active">Home</NavLink>
                </li>
                {isAuthenticated ? (
                    <>
                        <li>
                            <NavLink to="#" onClick={handleLogout} activeClassName="active">Logout</NavLink>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <NavLink to="/login" activeClassName="active">Login</NavLink>
                        </li>
                        <li>
                            <NavLink to="/signup" activeClassName="active">Signup</NavLink>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
