const Application = require("../models/application");

class ApplicationController {
  static async getApplicationForm(req, res) {
    res.render("form.html");
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
        req.body.fname,
        req.body.lname,
        req.body.email,
        req.body.lang,
        new Date(req.body.date).getTime() / 1000
      );
      await application.save();
      res.render("success.ejs", { application });
    } catch (err) {
      console.error(err);
      res.status(500).render("error.ejs", {
        errorCode: 500,
        errorMessage: "Wystąpił błąd podczas zapisywania zgłoszenia",
      });
    }
  }
}

module.exports = ApplicationController;
