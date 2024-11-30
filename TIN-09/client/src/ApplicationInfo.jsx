import React, { useState, useEffect } from "react";
import { Application } from "./application";
import { useNavigate, useParams } from "react-router-dom";
import "./ApplicationInfo.css";

function ApplicationInfo() {
  const [application, setApplication] = useState(
    new Application("", "", "", "", "", "")
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/applications/${id}`
        );
        if (!response.ok) {
          throw new Error("Brak zgłoszenia o podanym ID");
        }
        const data = await response.json();
        const application = new Application(
          data.id,
          data.fname,
          data.lname,
          data.email,
          data.lang,
          data.date
        );
        setApplication(application);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  const handleRedirect = () => {
    navigate("/applications");
  };

  if (loading) {
    return <h1>Ładowanie...</h1>;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <div>
      <h1>Zgłoszenie nr {application.id}</h1>
      <h2>Imię</h2>
      <p>{application.fname}</p>
      <h2>Nazwisko</h2>
      <p>{application.lname}</p>
      <h2>Email</h2>
      <p>{application.email}</p>
      <h2>Język</h2>
      <p>{application.language}</p>
      <h2>Data zajęć</h2>
      <p>{application.formattedDate}</p>
      <div className="center">
        <button onClick={handleRedirect}>Pokaż zgłoszenia</button>
      </div>
    </div>
  );
}

export default ApplicationInfo;
