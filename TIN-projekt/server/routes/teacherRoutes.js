const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacherController");
const verifyRole = require("../middlewares/verifyRoleMiddleware");
const { getRoles } = require("../config/roles");

router
  .get(
    "/:id/languages",
    verifyRole(getRoles().NAUCZYCIEL, getRoles().PRACOWNIK_ADMINISTRACYJNY),
    teacherController.getTeacherLanguages
  )
  .delete(
    "/:teacherId/languages/:languageId",
    verifyRole(getRoles().PRACOWNIK_ADMINISTRACYJNY),
    teacherController.removeTeacherLanguage
  )
  .get("/", teacherController.getAllTeachers);

module.exports = router;
