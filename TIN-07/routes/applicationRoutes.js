const express = require("express");
const router = express.Router();
const AppliactionController = require("../controllers/applicationController");

router.get("/form", AppliactionController.getApplicationForm);
router.get("/", AppliactionController.getApplications);
router.get("/:id", AppliactionController.getApplicationById);
router.post("/form/submit", AppliactionController.postApplicationForm);

module.exports = router;
