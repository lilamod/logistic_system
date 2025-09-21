import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li><Link to="/add-vehicle" className="sidebar-link">Vehicle</Link></li>
        <li><Link to="/search-book" className="sidebar-link">Booking</Link></li>
        <li><Link to="/logout" className="sidebar-link">Logout</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
