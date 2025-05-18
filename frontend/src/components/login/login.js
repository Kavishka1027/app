import { useNavigate, useLocation, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./login.css";

const Login = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to previous page or default if logged in
  const from = location.state?.from?.pathname || "/availableItems";

  useEffect(() => {
    const existingUserMongoId = localStorage.getItem("userId");
    console.log("Existing User ID:", existingUserMongoId);
    if (existingUserMongoId) {
      navigate(from, { replace: true });
    }
  }, [navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, password }),
      });

      const data = await response.json();

      if (data.status === "ok") {
        // Save to localStorage
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        localStorage.setItem("userId", data.user.id); // Save userId


        // Redirect to original destination
        navigate(from, { replace: true });
      } else {
        setError(data.err || "Login failed");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <div className="logo-container">
          <Link to="/">
            <img src="/logo.png" alt="Company Logo" className="logo-img" />
          </Link>
        </div>
        <h2>Login</h2>
        <p>Enter User ID and Password to login</p>

        {error && <p className="error">{error}</p>}

        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>

        <div className="forgot-password-link">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
