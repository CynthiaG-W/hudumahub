function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <span className="brand-icon small">✦</span>
        <strong>HudumaHub</strong>
      </div>

      <p>
        Helping you find essential services, closer to you.
      </p>

      <span>© {new Date().getFullYear()} HudumaHub</span>
    </footer>
  );
}

export default Footer;