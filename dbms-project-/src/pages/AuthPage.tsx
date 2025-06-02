import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import "../authpage.css";
const BackgroundImage = "/kodiback.jpg";
const Logo = "/kodilogo.jpg";

interface AuthProps {
  setIsAuthenticated: (auth: boolean) => void;
}

const AuthPage: React.FC<AuthProps> = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (email === "giddy@gmail.com" && password === "1234") {
      setIsAuthenticated(true);
      navigate("/dashboard");
    } else {
      alert("Invalid credentials! Please enter the correct email and password.");
    }
  };

  return (
    <div className="auth-container">
      <img src={BackgroundImage} alt="Background" className="background-img" />
      <div className="form-container">
        <img src={Logo} alt="Logo" className="logo" />
        <form onSubmit={handleLogin} className="form">
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />

          <div className="password-container">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <span 
              className="eye-icon" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          <button type="submit">Log In</button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
