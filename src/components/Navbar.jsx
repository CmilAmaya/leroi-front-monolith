import { useState, useEffect } from "react";
import { ThemeToggle } from "./ui/ThemeToggle";
import { Button } from "./ui/Button";
import PropTypes from "prop-types";
import { User } from "lucide-react";
import logo from "../assets/LOGO.png";
import "../styles/navbar.css";

Navbar.defaultProps = {
  t: {
    nav: {
      // tutorial: "Tutorial",
      about: "Quiénes somos",
      credits: "Créditos",
      faq: "Preguntas frecuentes",
      // blog: "Blog",
      support: "Soporte",
      contact: "Contacto",
      login: "Iniciar sesión",
      signup: "Registrarse",
      roadmap: "Roadmap", 
    },
  },
};

Navbar.propTypes = {
  t: PropTypes.shape({
    nav: PropTypes.shape({
      // tutorial: PropTypes.string,
      about: PropTypes.string,
      credits: PropTypes.string,
      faq: PropTypes.string,
      support: PropTypes.string,
      //blog: PropTypes.string,
      contact: PropTypes.string,
      login: PropTypes.string,
      signup: PropTypes.string,
      roadmap: PropTypes.string, 
    }),
  }),
};

function NavItem({ href, children }) {
  return (
    <a href={href} className="nav-item">
      {children}
    </a>
  );
}

NavItem.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

function Navbar({ t }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-row">
          {/* Logo */}
          <a href="/" className="navbar-logo">
            <div className="logo-container">
              <img src={logo} alt="Logo" className="logo-image" />
            </div>
            <span className="logo-text">Leroi</span>
          </a>

          {/* Menú hamburguesa para móviles */}
          <button className="hamburger-button" onClick={toggleMenu}>
            ☰
          </button>

          {/* Enlaces de navegación */}
          <div className={`navbar-links ${menuOpen ? "menu-open" : ""}`}>
            {/* <NavItem href="/#tutorial">{t.nav.tutorial}</NavItem> */}
            <NavItem href="/about">{t.nav.about}</NavItem>
            <NavItem href="/#credits">{t.nav.credits}</NavItem>
            <NavItem href="/#faq">{t.nav.faq}</NavItem>
            <NavItem href="/about/#team">{t.nav.contact}</NavItem>
            {/*<NavItem href="/blog">{t.nav.blog}</NavItem>*/}
            {isAuthenticated && (
              <NavItem href="/roadmap">{t.nav.roadmap}</NavItem>
            )}
          </div>

          {/* Botones de autenticación o perfil */}
          <div className="navbar-buttons">
            {isAuthenticated ? (
              <>
                {/* Ícono de perfil */}
                <button
                  className="profile-button"
                  onClick={() => (window.location.href = "/profile")}
                >
                  <User size={24} color="white" />
                </button>
                {/* Botón de logout */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="navbar-button"
                >
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                {/* Botones de inicio de sesión y registro */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    window.location.href = "/login";
                  }}
                  className="navbar-button"
                >
                  {t.nav.login}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    window.location.href = "/register";
                  }}
                  className="navbar-button"
                >
                  {t.nav.signup}
                </Button>
              </>
            )}
            {/* Tema */}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
