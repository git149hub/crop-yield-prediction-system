import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-brand">
          <div className="brand-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-8 2s.5-2 3-3C16 2 17 8 17 8z" fill="#4ade80"/>
            </svg>
          </div>
          <span className="brand-name">CropAI</span>
        </NavLink>

        <ul className={`navbar-links${menuOpen ? " open" : ""}`}>
          <li><NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink></li>
          <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Dashboard</NavLink></li>
          <li><NavLink to="/history" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>History</NavLink></li>
          <li><NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>About</NavLink></li>
        </ul>

        <button
          className={`hamburger${menuOpen ? " is-open" : ""}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {menuOpen && <div className="nav-overlay" onClick={() => setMenuOpen(false)} />}
    </nav>
  );
}
