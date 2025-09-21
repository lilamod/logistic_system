import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === "user@example.com" && password === "password123") {
      localStorage.setItem("isLoggedIn", "true");
      setIsLoggedIn(true);
      navigate("/home");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-page" role="main" aria-label="Login form">
      <div className="login-container">
        <h2>Welcome Back</h2>
        <form onSubmit={handleSubmit} noValidate>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="Email address"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-label="Password"
          />
          <button type="submit" aria-label="Log in">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
