const express = require("express");
const router = express.Router();
const AppliactionController = require("../controllers/applicationController");

router.get("/", AppliactionController.getApplications);
router.get("/:id", AppliactionController.getApplicationById);
router.post("/", AppliactionController.postApplicationForm);
router.put("/:id", AppliactionController.updateApplication);
router.delete("/:id", AppliactionController.deleteApplication);

module.exports = router;
