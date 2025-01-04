import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthContext from "../context/AuthProvider";
import "../styles/Header.css";

function Header() {
  // Pobierz dane użytkownika i funkcję do ich aktualizacji z kontekstu
  const { userData, setUserData } = useContext(AuthContext);

  // Funkcja do nawigacji
  const navigate = useNavigate();

  // Funkcja do wylogowania użytkownika
  const handleLogout = async () => {
    try {
      // Zapytanie do serwera o wylogowanie
      await axios.get("/auth/logout", { withCredentials: true });

      // Aktualizacja danych użytkownika
      setUserData(null);

      // Wyświetlenie komunikatu o wylogowaniu
      toast.success("Zostałeś wylogowany.");

      // Przekierowanie na stronę główną
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Wystąpił błąd podczas wylogowywania. Spróbuj ponownie.");
    }
  };

  return (
    <header className="App-header">
      <nav>
        <ul>
          <li>
            <div className="logo-container">
              <img src="/favicon.ico" alt="Logo" className="logo" />
              <span className="logo-text">Szkoła Inglisz</span>
            </div>
          </li>
          <li>
            <Link to="/">Szkoła</Link>
          </li>
          <li>
            <Link to="/about">O nas</Link>
          </li>
          <li>
            <Link to="/contact">Kontakt</Link>
          </li>
          {userData && (
            <li>
              <Link to="/courses">Moje kursy</Link>
            </li>
          )}
          {userData && (
            <li>
              <Link to="/profile">Mój profil</Link>
            </li>
          )}
          <li>
            {userData ? (
              <button onClick={handleLogout}>Wyloguj się</button>
            ) : (
              <button onClick={() => navigate("/login")}>Zaloguj się</button>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
