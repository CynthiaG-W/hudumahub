function Navbar({ user, onNavigate, onLogout }) {
  return (
    <header className="navbar">
      <button
        className="brand"
        onClick={() => onNavigate("home")}
        aria-label="Go to home"
      >
        <span className="brand-icon">✦</span>

        <span className="brand-text">
          <span className="brand-name">HudumaHub</span>
          <span className="brand-tagline">
            Essential services, closer to you
          </span>
        </span>
      </button>

      <nav className="nav-links">
        <button onClick={() => onNavigate("home")}>
          Discover
        </button>

        {user && (
          <button onClick={() => onNavigate("my-hub")}>
            My Hub
          </button>
        )}
      </nav>

      <div className="nav-actions">
        {user ? (
          <>
            <span className="welcome-text">
              Hi, {user.username}
            </span>

            <button
              className="logout-button"
              onClick={onLogout}
            >
              Log out
            </button>
          </>
        ) : (
          <button
            className="login-button"
            onClick={() => onNavigate("login")}
          >
            Log in
          </button>
        )}
      </div>
    </header>
  );
}

export default Navbar;