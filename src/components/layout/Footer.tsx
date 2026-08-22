import './Footer.css';

/**
 * Site footer shown on every page. Purely presentational.
 */
function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner page-container">
        <p className="footer__text">
          &copy; {currentYear} Movie Explorer. Movie data provided by OMDb API.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
