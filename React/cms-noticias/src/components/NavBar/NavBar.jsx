import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
    const location = useLocation();
    const { user, role } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen(!menuOpen);
    const closeMenu = () => setMenuOpen(false);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo" onClick={closeMenu}>
                    <span className="logo-strong">CORP</span>NEWS
                </Link>

                <div className={`hamburger ${menuOpen ? "open" : ""}`} onClick={toggleMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
                    <li>
                        <Link to="/" onClick={closeMenu} className={location.pathname === "/" ? "active" : ""}>
                            Inicio
                        </Link>
                    </li>
                    <li>
                        <Link to="/noticias" onClick={closeMenu} className={location.pathname === "/noticias" ? "active" : ""}>
                            Noticias
                        </Link>
                    </li>

                    {user && (role === "reportero" || role === "editor") && (
                        <li>
                            <Link to="/dashboard" onClick={closeMenu} className={location.pathname === "/dashboard" ? "active" : ""}>
                                Dashboard
                            </Link>
                        </li>
                    )}

                    {user && role === "reportero" && (
                        <li>
                            <Link to="/crear" onClick={closeMenu} className={location.pathname === "/crear" ? "active" : ""}>
                                Crear
                            </Link>
                        </li>
                    )}

                    {!user && (
                        <li>
                            <Link to="/login" onClick={closeMenu} className={location.pathname === "/login" ? "active" : ""}>
                                Login
                            </Link>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
