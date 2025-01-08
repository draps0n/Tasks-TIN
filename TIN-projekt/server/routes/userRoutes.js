const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");
const verifyRole = require("../middlewares/verifyRoleMiddleware.js");
const { getRoles } = require("../config/roles.js");

router
  .get(
    "/",
    verifyRole(getRoles().PRACOWNIK_ADMINISTRACYJNY),
    userController.getAllUsers
  )
  .get("/profile", userController.getUserById)
  .put("/profile", userController.updateUser);

module.exports = router;
