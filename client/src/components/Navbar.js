import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <ul>
          <li><Link to="/home" className="navbar-link">Home</Link></li>
          <li><Link to="/login" className="navbar-link">Login</Link></li>
          <li><Link to="/dashboard" className="navbar-link">Dashboard</Link></li>
          <li><Link to="/settings" className="navbar-link">Settings</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
