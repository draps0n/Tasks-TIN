import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Home Page</h1>
      <nav>
        <div className="button-container">
          <button
            onClick={() => navigate("/applications")}
            className="nav-button"
          >
            Zgłoszenia
          </button>
          <button
            onClick={() => navigate("/applications/form")}
            className="nav-button"
          >
            Zgłoś się
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Home;
