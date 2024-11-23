import React, { useState } from "react";
import { IoIosAdd } from "react-icons/io";
import Application from "./application";
import ApplicationItem from "./ApplicationItem";
import "./ApplicationList.css";

function ApplicationList() {
  const [applications, setApplications] = useState([
    new Application(1, "Jan", "Kowalski", "mail", "eng", 1622749200),
    new Application(2, "Jan", "Kowalski", "mail", "eng", 1622749200),
    new Application(3, "Jan", "Kowalski", "mail", "eng", 1622749200),
    new Application(4, "Jan", "Kowalski", "mail", "eng", 1622749200),
    new Application(5, "Jan", "Kowalski", "mail", "eng", 1622749200),
    new Application(6, "Jan", "Kowalski", "mail", "eng", 1622749200),
    new Application(7, "Jan", "Kowalski", "mail", "eng", 1622749200),
    new Application(8, "Jan", "Kowalski", "mail", "eng", 1622749200),
  ]);

  const [formValues, setFormValues] = useState({
    fname: "",
    lname: "",
    email: "",
    lang: "",
    date: "",
  });

  const [errors, setErrors] = useState({
    fname: "",
    lname: "",
    email: "",
    lang: "",
    date: "",
  });

  const addApplication = () => {
    const newApplication = new Application(
      applications.length + 1,
      formValues.fname,
      formValues.lname,
      formValues.email,
      formValues.lang,
      new Date(formValues.date).getTime() / 1000
    );
    setApplications([...applications, newApplication]);
    setFormValues({
      fname: "",
      lname: "",
      email: "",
      lang: "",
      date: "",
    });
  };

  const deleteApplication = (id) => {
    setApplications(applications.filter((app) => app.id !== id));
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "fname":
      case "lname":
        if (value.length < 3) {
          error = "Minimum 3 znaki";
        }
        break;
      case "email":
        if (!/\S+@\S+\.\S+/.test(value)) {
          error = "Niepoprawny format email";
        }
        break;
      case "lang":
        if (!value) {
          error = "Pole wymagane";
        }
        break;
      case "date":
        if (!value) {
          error = "Wybierz datę";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
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
          {applications.map((application, index) => (
            <ApplicationItem
              key={index}
              application={application}
              onDelete={deleteApplication}
            />
          ))}
          <tr>
            <td>
              <div className="input-container">
                <input
                  type="text"
                  placeholder="Imię"
                  name="fname"
                  value={formValues.fname}
                  onChange={handleChange}
                  className={`input-field ${errors.fname ? "error" : ""}`}
                />
                {errors.fname && (
                  <div className="error-message">{errors.fname}</div>
                )}
              </div>
            </td>
            <td>
              <div className="input-container">
                <input
                  type="text"
                  placeholder="Nazwisko"
                  name="lname"
                  value={formValues.lname}
                  onChange={handleChange}
                  className={`input-field ${errors.lname ? "error" : ""}`}
                />
                {errors.lname && (
                  <div className="error-message">{errors.lname}</div>
                )}
              </div>
            </td>
            <td>
              <div className="input-container">
                <input
                  type="email"
                  placeholder="E-mail"
                  name="email"
                  value={formValues.email}
                  onChange={handleChange}
                  className={`input-field ${errors.email ? "error" : ""}`}
                />
                {errors.email && (
                  <div className="error-message">{errors.email}</div>
                )}
              </div>
            </td>
            <td>
              <div className="input-container">
                <input
                  type="text"
                  placeholder="Język"
                  name="lang"
                  value={formValues.lang}
                  onChange={handleChange}
                  className={`input-field ${errors.lang ? "error" : ""}`}
                />
                {errors.lang && (
                  <div className="error-message">{errors.lang}</div>
                )}
              </div>
            </td>
            <td>
              <div className="input-container">
                <input
                  type="date"
                  name="date"
                  value={formValues.date}
                  onChange={handleChange}
                  className={`input-field ${errors.date ? "error" : ""}`}
                />
                {errors.date && (
                  <div className="error-message">{errors.date}</div>
                )}
              </div>
            </td>
            <td>
              <button
                onClick={addApplication}
                className="add-button"
                disabled={
                  Object.values(errors).some((error) => error) ||
                  Object.values(formValues).some((value) => !value)
                }
              >
                <IoIosAdd />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ApplicationList;
