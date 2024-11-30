import React, { useState } from "react";
import { languages } from "./application";
import "./ApplicationForm.css";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";

function ApplicationForm() {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    lang: "",
    date: "",
  });

  const handleGoBack = () => {
    navigate(-1);
  };

  const validator = {
    fname: {
      test: (value) => value.length >= 3,
      errorMessage: "Minimum 3 znaki",
    },
    lname: {
      test: (value) => value.length >= 3,
      errorMessage: "Minimum 3 znaki",
    },
    email: {
      test: (value) => /\S+@\S+\.\S+/.test(value),
      errorMessage: "Niepoprawny format email",
    },
    lang: {
      test: (value) => !!languages[value],
      errorMessage: "Pole wymagane",
    },
    date: {
      test: (value) => !!value,
      errorMessage: "Wybierz datę",
    },
  };

  const validateField = (name, value) => {
    let validatorObj = validator[name];
    if (!validatorObj.test(value)) {
      return validatorObj.errorMessage;
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid =
      Object.values(errors).every((error) => error === "") &&
      Object.values(formData).every((value) => value !== "");

    if (isValid) {
      fetch("http://localhost:5000/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          setFormData({
            fname: "",
            lname: "",
            email: "",
            lang: "",
            date: "",
          });
          setErrors({});
          setModalContent("Zgłoszenie zostało przesłane.");
        })
        .catch((error) => {
          console.error("Error:", error);
          setModalContent("Wystąpił błąd podczas przesyłania zgłoszenia.");
        })
        .finally(() => {
          setShowModal(true);
        });
    } else {
      console.log("Form contains errors.");
      setModalContent("W formularzu są błędy!");
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (modalContent === "Zgłoszenie zostało przesłane.")
      navigate("/applications");
  };

  return (
    <div className="form-container">
      <button className="top-left-button" onClick={handleGoBack}>
        <IoIosArrowBack />
      </button>
      <h1>Formularz zgłoszeniowy</h1>
      <form onSubmit={handleSubmit}>
        <label>Imię</label>
        <input
          type="text"
          name="fname"
          placeholder="Wpisz imię..."
          value={formData.fname}
          onChange={handleChange}
        />
        {errors.fname && <div className="error-message">{errors.fname}</div>}
        <label>Nazwisko</label>
        <input
          type="text"
          name="lname"
          placeholder="Wpisz nazwisko..."
          value={formData.lname}
          onChange={handleChange}
        />
        {errors.lname && <div className="error-message">{errors.lname}</div>}
        <label>E-mail</label>
        <input
          type="email"
          name="email"
          placeholder="Wpisz adres e-mail..."
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <div className="error-message">{errors.email}</div>}
        <label>Wybierz język zajęć:</label>
        <select name="lang" value={formData.lang} onChange={handleChange}>
          <option value="">Wybierz...</option>
          {Object.entries(languages).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
        {errors.lang && <div className="error-message">{errors.lang}</div>}
        <label>Data rozpoczęcia zajęć</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />
        {errors.date && <div className="error-message">{errors.date}</div>}
        <input id="submit" type="submit" value="Wyślij zgłoszenie" />
      </form>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{modalContent}</h2>
            <button onClick={handleCloseModal}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApplicationForm;
