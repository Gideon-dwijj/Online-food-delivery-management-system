import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../authpage.css";
const BackgroundImage = "/kodiback.jpg";
const Logo = "/kodilogo.jpg";


const SignUp: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Add sign-up logic (API call, Firebase, etc.)
    navigate("/dashboard"); // Redirect to dashboard after sign-up
  };

  return (
    <div className="auth-container">
      <img src={BackgroundImage} alt="Background" className="background-img" />
      <div className="form-container">
        <img src={Logo} alt="Logo" className="logo" />
        <h2>Sign Up</h2>
        <form onSubmit={handleSignUp} className="form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Sign Up</button>
          <p className="login-text">
            Already have an account?{" "}
            <Link to="/" className="logintext">Log In</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
