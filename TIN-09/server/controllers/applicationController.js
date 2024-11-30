const Application = require("../models/application");

class ApplicationController {
  static async getApplications(req, res) {
    try {
      const applications = await Application.getAll();
      res.json(applications);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: "Wystąpił błąd podczas pobierania zgłoszeń",
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
        new Date(req.body.date).getTime()
      );
      const id = await application.save();
      application.id = id;
      res.json(application);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: "Wystąpił błąd podczas zapisywania zgłoszenia",
      });
    }
  }

  static async getApplicationById(req, res) {
    const application = await Application.getById(req.params.id);
    if (!application) {
      res.status(404).json({
        error: "Nie znaleziono zgłoszenia",
      });
      return;
    }

    res.json(application);
  }

  static async deleteApplication(req, res) {
    const application = await Application.getById(req.params.id);
    if (!application) {
      res.status(404).json({
        error: "Nie znaleziono zgłoszenia",
      });
      return;
    }

    await application.delete();
    res.json(application);
  }
}

module.exports = ApplicationController;
