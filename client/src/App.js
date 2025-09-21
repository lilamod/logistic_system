import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from "./AppRouter";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import "./styles/App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false");
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="App">
        {isLoggedIn ? (
          <div className="layout">
            <Sidebar />
            <Navbar onLogout={handleLogout} />
            <main className="content">
              <AppRouter setIsLoggedIn={setIsLoggedIn} />
            </main>
          </div>
        ) : (
          <AppRouter setIsLoggedIn={setIsLoggedIn} />
        )}
      </div>
    </Router>
  );
}

export default App;
