import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const loggedInUser = JSON.parse(
    localStorage.getItem("loggedInUser") || "null"
  );

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");

    toast.success("Déconnexion réussie !", {
      position: "top-right",
    });

    setTimeout(() => {
      navigate("/login");
      window.location.reload();
    }, 1000);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <ul className="navbar-list">
            <li className="navbar-item">
              <Link className="navbar-link" to="/home">
                Accueil
              </Link>
            </li>
            <li className="navbar-item">
              <Link className="navbar-link" to="/library">
                Bibliothèque
              </Link>
            </li>
            <li className="navbar-item">
              <Link className="navbar-link" to="/favoris">
                Favoris
              </Link>
            </li>
          </ul>
        </div>
        <div className="navbar-right">
          <ul className="navbar-list">
            {loggedInUser ? (
              <>
                <li className="navbar-item">
                  <Link className="navbar-link" to="/profile">
                    Profil
                  </Link>
                </li>
                <li className="navbar-item">
                  <Link
                    className="navbar-link"
                    to="/login"
                    onClick={handleLogout}
                  >
                    Déconnexion
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="navbar-item">
                  <Link className="navbar-link" to="/login">
                    Se connecter
                  </Link>
                </li>
                <li className="navbar-item">
                  <Link className="navbar-link" to="/signup">
                    S'inscrire
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
