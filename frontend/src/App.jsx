import "./App.css";

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">HudumaHub</div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#services">Services</a>
          <a href="#about">About</a>
        </div>
      </nav>

      <main>
        <section className="hero" id="home">
          <h1>Find Essential Services Near You</h1>

          <p>
            Discover hospitals, pharmacies, ATMs, police stations,
            and other essential services around you.
          </p>

          <div className="search-container">
            <input
              type="text"
              placeholder="What service are you looking for?"
            />
            <button>Search</button>
          </div>
        </section>

        <section className="services" id="services">
          <h2>Popular Services</h2>

          <div className="service-categories">
            <button>🏥 Hospitals</button>
            <button>💊 Pharmacies</button>
            <button>🏧 ATMs</button>
            <button>🚔 Police Stations</button>
            <button>⛽ Petrol Stations</button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;