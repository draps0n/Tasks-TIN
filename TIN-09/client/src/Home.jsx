import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <nav>
        <ul>
          <li>
            <Link to="/applications">Applications</Link>
          </li>
          <li>
            <Link to="/applications/form">Application Form</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Home;
