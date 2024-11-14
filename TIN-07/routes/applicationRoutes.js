const express = require("express");
const router = express.Router();
const AppliactionController = require("../controllers/applicationController");

router.get("/form", AppliactionController.getApplicationForm);
router.get("/", AppliactionController.getApplications);
router.post("/form", AppliactionController.postApplicationForm);

module.exports = router;
