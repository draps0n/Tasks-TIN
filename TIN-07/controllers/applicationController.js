const Application = require("../models/application");

class ApplicationController {
  static async getApplicationForm(req, res) {
    res.render("form.ejs", { title: "Formularz zgłoszeniowy" });
  }

  static async getApplications(req, res) {
    try {
      const applications = await Application.getAll();
      res.render("applications.ejs", { applications });
    } catch (err) {
      console.error(err);
      res.status(500).render("error.ejs", {
        errorCode: 500,
        errorMessage: "Wystąpił błąd podczas pobierania zgłoszeń",
      });
    }
  }

  static async postApplicationForm(req, res) {
    try {
      const application = new Application(
        null,
        req.body.fname,
        req.body.lname,
        req.body.email,
        req.body.lang,
        new Date(req.body.date).getTime() / 1000
      );
      await application.save();
      res.render("application.ejs", {
        title: "Zgłoszenie przesłane",
        application,
      });
    } catch (err) {
      console.error(err);
      res.status(500).render("error.ejs", {
        errorCode: 500,
        errorMessage: "Wystąpił błąd podczas zapisywania zgłoszenia",
      });
    }
  }

  static async getApplicationById(req, res) {
    const application = await Application.getById(req.params.id);
    if (!application) {
      res.status(404).render("error.ejs", {
        errorCode: 404,
        errorMessage: "Nie znaleziono zgłoszenia",
      });
      return;
    }

    res.render("application.ejs", {
      title: `Zgłoszenie nr ${application.id}`,
      application,
    });
  }
}

module.exports = ApplicationController;
