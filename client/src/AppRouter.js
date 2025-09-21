import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SearchAndBook from "./pages/SearchAndBook";
import VehicleTable from "./components/VehicleTable";
import VehicleManager from "./pages/AddVehicle";
import BookingTable from "./components/BookingTable";

const AppRouter = ({ setIsLoggedIn }) => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes */}
      <Route
        path="/home"
        element={
          localStorage.getItem("isLoggedIn") === "true" ? (
            <Home />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      
      {/* Default Redirect to Login */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/add-vehicle" element={<VehicleManager/>} />
      <Route path="/search-book" element={<BookingTable/>} />
    </Routes>
  );
};

export default AppRouter;
