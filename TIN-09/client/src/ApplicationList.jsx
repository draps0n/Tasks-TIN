import React, { useState, useEffect } from "react";
import ApplicationItem from "./ApplicationListItem";
import { useNavigate } from "react-router-dom";
import "./ApplicationList.css";
import { Application } from "./application";
import { IoIosArrowBack } from "react-icons/io";

function ApplicationList() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/applications")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        data = data.map((application) => {
          return new Application(
            application.id,
            application.fname,
            application.lname,
            application.email,
            application.lang,
            application.date
          );
        });
        setApplications(data);
      })
      .catch((error) => console.error(error));
  }, []);

  const deleteApplication = async (event, id) => {
    event.stopPropagation();
    try {
      const response = await fetch(`http://localhost:5000/applications/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setApplications(applications.filter((app) => app.id !== id));
      } else {
        console.error("Błąd podczas usuwania aplikacji z bazy danych");
      }
    } catch (error) {
      console.error("Wystąpił błąd:", error);
      alert(
        "Wystąpił błąd podczas usuwania aplikacji. Spróbuj ponownie później."
      );
    }
  };

  const handleAdd = () => {
    navigate("form");
  };

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div className="application-list-container">
      <button className="top-left-button" onClick={handleGoBack}>
        <IoIosArrowBack /> Powrót
      </button>
      <h1>Lista zgłoszeń</h1>
      <table className="scrollable-table">
        <thead>
          <tr>
            <th>Imie</th>
            <th>Nazwisko</th>
            <th>E-mail</th>
            <th>Język</th>
            <th>Data zajęć</th>
            <th></th>
          </tr>
        </thead>
        <tbody className="scroll-tbody">
          {applications.map((application) => (
            <ApplicationItem
              key={application.id}
              application={application}
              onDelete={deleteApplication}
            />
          ))}
        </tbody>
      </table>
      <button className="bottom-right-button" onClick={handleAdd}>
        Dodaj aplikację
      </button>
    </div>
  );
}

export default ApplicationList;
