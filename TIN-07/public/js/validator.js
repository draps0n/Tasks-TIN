const form = document.getElementById("form");
const errorSummary = document.getElementById("error-summary");
let isInvalid;

form.addEventListener("submit", (e) => {
  isInvalid = false;
  fname.classList.remove("wrong");

  validateFName();
  validateLName();
  validateEmail();
  validateDate();
  validateLang();

  if (isInvalid) {
    errorSummary.innerHTML = "W formularzu są błędy!";
    errorSummary.classList.add("visible");
    errorSummary.classList.remove("hidden");
    e.preventDefault();
  } else {
    errorSummary.innerHTML = "";
    errorSummary.classList.add("hidden");
    errorSummary.classList.remove("visible");
  }
});

function validateFName() {
  const fname = document.getElementById("fname");
  const fnameError = document.getElementById("fname-error");
  if (fname.value === null || fname.value.trim() === "") {
    showError(fname, fnameError, "Imie jest wymagane.");
  } else if (fname.value.length < 2 || fname.value.length > 30) {
    showError(fname, fnameError, "Imie musi mieć od 2 do 30 znaków.");
  } else if (!/^[a-zA-ZąęłńóśźżĄĘŁŃÓŚŹŻ]+$/.test(fname.value)) {
    showError(fname, fnameError, "Imie musi składać się z samych liter.");
  } else {
    hideError(fname, fnameError);
  }
}

function validateLName() {
  const lname = document.getElementById("lname");
  const lnameError = document.getElementById("lname-error");
  if (lname.value === null || lname.value.trim() === "") {
    showError(lname, lnameError, "Nazwisko jest wymagane.");
  } else if (lname.value.length < 2 || lname.value.length > 30) {
    showError(lname, lnameError, "Imie musi mieć od 2 do 30 znaków.");
  } else if (!/^[a-zA-ZąęłńóśźżĄĘŁŃÓŚŹŻ]+$/.test(lname.value)) {
    showError(lname, lnameError, "Nazwisko musi składać się z samych liter.");
  } else {
    hideError(lname, lnameError);
  }
}

function validateEmail() {
  const email = document.getElementById("email");
  const emailError = document.getElementById("email-error");
  if (email.value === null || email.value.trim() === "") {
    showError(email, emailError, "Adres e-mail jest wymagany.");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    showError(email, emailError, "Adres e-mail jest niepoprawny.");
  } else {
    hideError(email, emailError);
  }
}

function validateDate() {
  const date = document.getElementById("date");
  const dateError = document.getElementById("date-error");
  let today = new Date();
  let yearAfter = new Date().setFullYear(today.getFullYear() + 1);
  if (date.value === null || date.value.trim() === "") {
    showError(date, dateError, "Data zajęć jest wymagana.");
  } else if (new Date(date.value) <= today) {
    showError(date, dateError, "Data musi być poźniejsza od obecnej.");
  } else if (new Date(date.value) > yearAfter) {
    showError(
      date,
      dateError,
      "Można zgłaszać się na zajęcia na maksymalnie rok w przód."
    );
  } else {
    hideError(date, dateError);
  }
}

function validateLang() {
  const lang = document.getElementById("lang");
  const langError = document.getElementById("lang-error");
  if (lang.value === null || lang.value.trim() === "") {
    showError(lang, langError, "Język zajęć nie został wybrany.");
  } else {
    hideError(lang, langError);
  }
}

function showError(inputField, element, message) {
  isInvalid = true;
  element.classList.add("visible");
  element.classList.remove("hidden");
  inputField.classList.add("wrong");
  element.innerHTML = message;
}

function hideError(inputField, element) {
  element.classList.add("hidden");
  element.classList.remove("visible");
  inputField.classList.remove("wrong");
  element.innerHTML = "";
}
