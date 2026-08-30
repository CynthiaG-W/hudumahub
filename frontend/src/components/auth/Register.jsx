import { useState } from "react";

const API_BASE_URL = "http://127.0.0.1:5000/api";

function Register({ onSwitchToLogin }) {
const [username, setUsername] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [message, setMessage] = useState("");

const handleRegister = async (event) => {
event.preventDefault();

setLoading(true);
setError("");
setMessage("");

try {
  const response = await fetch(
    `${API_BASE_URL}/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username.trim(),
        email: email.trim(),
        password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Unable to create your account."
    );
  }

  setMessage(
    "Account created successfully! You can now log in."
  );

  // Take the user to Login after a short delay
  setTimeout(() => {
    onSwitchToLogin();
  }, 1500);

} catch (err) {
  console.error("Registration error:", err);

  setError(
    err.message ||
      "Unable to create your account. Please try again."
  );
} finally {
  setLoading(false);
}

};

return ( <div className="auth-container"> <div className="auth-card"> <h2>Create an Account</h2>

    <p className="auth-subtitle">
      Join HudumaHub and save important places in your personal Hub.
    </p>

    {error && (
      <p className="status-message error-message">
        {error}
      </p>
    )}

    {message && (
      <p className="status-message success-message">
        ✓ {message}
      </p>
    )}

    <form onSubmit={handleRegister}>
      <div className="form-group">
        <label htmlFor="register-username">
          Username
        </label>

        <input
          id="register-username"
          type="text"
          value={username}
          onChange={(event) =>
            setUsername(event.target.value)
          }
          placeholder="Choose a username"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="register-email">
          Email
        </label>

        <input
          id="register-email"
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
        <label htmlFor="register-password">
          Password
        </label>

        <input
          id="register-password"
          type="password"
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
          placeholder="Create a password"
          required
          minLength="6"
        />
      </div>

      <button
        type="submit"
        className="auth-button"
        disabled={loading}
      >
        {loading
          ? "Creating account..."
          : "Create account"}
      </button>
    </form>

    <p className="auth-switch">
      Already have an account?{" "}
      <button
        type="button"
        onClick={onSwitchToLogin}
      >
        Login
      </button>
    </p>
  </div>
</div>

);
}

export default Register;
