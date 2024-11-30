import React, { useState, useEffect } from "react";
import ApplicationItem from "./ApplicationListItem";
import "./ApplicationList.css";
import { Application } from "./application";

function ApplicationList() {
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

  const deleteApplication = async (id) => {
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

  return (
    <div className="ApplicationList.css">
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
    </div>
  );
}

export default ApplicationList;
