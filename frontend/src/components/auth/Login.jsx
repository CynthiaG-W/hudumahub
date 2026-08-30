import { useState } from "react";

const API_BASE_URL = "https://hudumahub.onrender.com/api";

function Login({ onSuccess, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to log in."
        );
      }

      // Send the successful login data to App.jsx
      onSuccess(data);
    } catch (err) {
      console.error("Login error:", err);

      setError(
        err.message ||
          "Unable to log in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>

        <p className="auth-subtitle">
          Log in to save and manage your favorite services.
        </p>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="login-email">
              Email
            </label>

            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">
              Password
            </label>

            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToRegister}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;