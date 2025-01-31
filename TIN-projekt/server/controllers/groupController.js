const groupModel = require("../models/groupModel");
const teacherModel = require("../models/teacherModel");
const levelModel = require("../models/levelModel");
const languageModel = require("../models/languageModel");
const applicationModel = require("../models/applicationModel");
const daysOfWeek = require("../constants/daysOfWeek");
const studentModel = require("../models/studentModel");
const { pool } = require("../db/database");
const { getRoles } = require("../config/roles");

const getAllGroups = async (req, res) => {
  if (req.query.page && isNaN(req.query.page)) {
    return res.status(400).json({ message: "Page must be a number" });
  }

  if (req.query.limit && isNaN(req.query.limit)) {
    return res.status(400).json({ message: "Limit must be a number" });
  }

  // Pobranie parametrów paginacji
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const offset = (page - 1) * limit;

  try {
    let groups;
    let totalGroups;
    if (page && limit) {
      // Pobranie grup
      groups = await groupModel.getAllGroups(limit, offset);

      // Pobranie liczby wszystkich grup
      totalGroups = await groupModel.getTotalGroups();
    } else {
      // Pobranie wszystkich grup
      groups = await groupModel.getAllGroups();

      // Pobranie liczby wszystkich grup
      totalGroups = groups.length;
    }

    // Zwrócenie grup
    const totalPages = Math.ceil(totalGroups / limit);
    res.status(200).json({
      groups,
      totalPages: totalPages > 0 ? totalPages : 1,
    });
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAvailableGroupsForUser = async (req, res) => {
  if (!req.userId || isNaN(req.userId)) {
    return res.status(400).json({ message: "User id is required" });
  }

  try {
    const studentId = req.userId;
    const fetchedStudent = await studentModel.getStudentById(studentId);

    if (!fetchedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Pobranie grup z wolnymi miejscami
    groups = await groupModel.getAvailableGroupsForUser(studentId);

    // Zwrócenie grup
    res.status(200).json({
      groups,
    });
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUserGroups = async (req, res) => {
  const userId = req.userId;

  if (!userId || isNaN(userId)) {
    return res.status(400).json({ message: "User id is required" });
  }

  if (req.query.page && isNaN(req.query.page)) {
    return res.status(400).json({ message: "Page must be a number" });
  }

  if (req.query.limit && isNaN(req.query.limit)) {
    return res.status(400).json({ message: "Limit must be a number" });
  }

  // Pobranie parametrów paginacji
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const offset = (page - 1) * limit;

  try {
    let groups;
    let totalGroups;

    if (page && limit) {
      // Pobranie grup
      groups = await groupModel.getUserGroups(userId, limit, offset);

      // Pobranie liczby wszystkich grup
      totalGroups = await groupModel.getTotalUserGroups(userId);
    } else {
      // Pobranie wszystkich grup
      groups = await groupModel.getUserGroups(userId);

      // Pobranie liczby wszystkich grup
      totalGroups = groups.length;
    }

    // Zwrócenie grup
    const totalPages = Math.ceil(totalGroups / limit);
    res.status(200).json({
      groups,
      totalPages: totalPages > 0 ? totalPages : 1,
    });
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getTeacherGroups = async (req, res) => {
  const userId = req.userId;

  if (!userId || isNaN(userId)) {
    return res.status(400).json({ message: "User id is required" });
  }

  if (req.query.page && isNaN(req.query.page)) {
    return res.status(400).json({ message: "Page must be a number" });
  }

  if (req.query.limit && isNaN(req.query.limit)) {
    return res.status(400).json({ message: "Limit must be a number" });
  }

  // Pobranie parametrów paginacji
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const offset = (page - 1) * limit;

  try {
    const fetchedTeacher = await teacherModel.getTeacherById(userId);
    if (!fetchedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    let groups;
    let totalGroups;

    if (page && limit) {
      // Pobranie grup
      groups = await groupModel.getTeacherGroups(userId, limit, offset);

      // Pobranie liczby wszystkich grup
      totalGroups = await groupModel.getTotalTeacherGroups(userId);
    } else {
      // Pobranie wszystkich grup
      groups = await groupModel.getTeacherGroups(userId);

      // Pobranie liczby wszystkich grup
      totalGroups = groups.length;
    }

    // Zwrócenie grup
    const totalPages = Math.ceil(totalGroups / limit);
    res.status(200).json({
      groups,
      totalPages: totalPages > 0 ? totalPages : 1,
    });
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getGroupById = async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: "Group id is required" });
  }

  if (isNaN(id)) {
    return res.status(400).json({ message: "Group id must be a number" });
  }

  try {
    // Pobranie grupy
    const group = await groupModel.getGroupById(id);

    // Pobranie zajętych miejsc w grupie
    const takenPlaces = await groupModel.getTakenPlaces(id);

    let absences = null;
    if (req.userId && !isNaN(req.userId) && req.roleId === getRoles().KURSANT) {
      const userId = req.userId;

      absences = await groupModel.getUserAbsences(id, userId);
    }

    // Sprawdzenie czy grupa istnieje
    if (group) {
      res.status(200).json({ group, takenPlaces, absences });
    } else {
      res.status(404).json({ message: "Group not found" });
    }
  } catch (error) {
    console.error("Error fetching group:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteGroup = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ message: "Group id is required" });
  }

  if (isNaN(id)) {
    return res.status(400).json({ message: "Group id must be a number" });
  }

  const fetchedGroup = await groupModel.getGroupById(id);
  if (!fetchedGroup) {
    return res.status(404).json({ message: "Group not found" });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    // Usunięcie zgłoszeń na grupę
    await applicationModel.deleteApplicationByGroupId(id, connection);

    // Usuń przypisania studentów do grupy
    await groupModel.deleteStudentGroupAssignments(id, connection);

    // Usunięcie grupy
    await groupModel.deleteGroup(id, connection);

    await connection.commit();
    res.status(200).send("Group deleted");
  } catch (error) {
    await connection.rollback();
    console.error("Error deleting group:", error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    connection.release();
  }
};

const validateGroup = async (group) => {
  const {
    places,
    price,
    description,
    levelId,
    day,
    startTime,
    endTime,
    teacherId,
    languageId,
  } = group;

  console.log(
    places,
    price,
    description,
    levelId,
    day,
    startTime,
    endTime,
    teacherId,
    languageId
  );

  if (
    !places ||
    !price ||
    !description ||
    !levelId ||
    !day ||
    !startTime ||
    !endTime ||
    !teacherId ||
    !languageId
  ) {
    return { code: 400, message: "All group fields are required" };
  }

  if (isNaN(places)) {
    return { code: 400, message: "Places must be a number" };
  }

  if (places < 6 || places > 20) {
    return { code: 400, message: "Places must be between 6 and 20" };
  }

  if (isNaN(price)) {
    return { code: 400, message: "Price must be a number" };
  }

  if (price < 0 || price > 1000) {
    return { code: 400, message: "Price must be in range (0, 1000)" };
  }

  if (description.length < 5 || description.length > 250) {
    return {
      code: 400,
      message: "Description must be between 5 to 250 characters",
    };
  }

  const teacher = await teacherModel.getTeacherById(teacherId);
  if (!teacher) {
    return { code: 404, message: "Teacher not found" };
  }

  const level = await levelModel.getLevelById(levelId);
  if (!level) {
    return { code: 404, message: "Level not found" };
  }

  const language = await languageModel.getLanguageById(languageId);
  if (!language) {
    return { code: 404, message: "Language not found" };
  }

  let teacherLanguages = await teacherModel.getTeacherLanguages(teacherId);
  teacherLanguages = teacherLanguages.map((lang) => lang.id);
  console.log("teacherLanguages", teacherLanguages);
  if (teacherLanguages.indexOf(languageId) === -1) {
    return {
      code: 409,
      message: "Teacher does not teach this language",
    };
  }

  if (daysOfWeek.indexOf(day) === -1) {
    return { code: 400, message: "Invalid day" };
  }

  if (startTime >= endTime) {
    return { code: 400, message: "End time must be later than start time" };
  }

  if (endTime <= startTime) {
    return { code: 400, message: "Start time must be earlier than end time" };
  }

  return null;
};

const createGroup = async (req, res) => {
  const group = req.body;

  // Walidacja grupy
  error = await validateGroup(group);
  if (error) {
    return res.status(error.code).json({ message: error.message });
  }

  // Konwersja miejsc i ceny na liczby
  group.places = parseInt(group.places);
  group.price = parseInt(group.price);

  // Dodanie grupy do bazy
  try {
    const groupId = await groupModel.addNewGroup(group);
    res.status(201).json({ message: "Group created", groupId });
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateGroup = async (req, res) => {
  const id = req.params.id;
  const group = req.body;

  console.log("group", group);
  console.log("id", id);

  // Sprawdzenie czy podano id grupy
  if (!id) {
    return res.status(400).json({ message: "Group id is required" });
  }

  if (isNaN(id)) {
    return res.status(400).json({ message: "Group id must be a number" });
  }

  // Walidacja grupy
  error = await validateGroup(group);
  if (error) {
    return res.status(error.code).send(error.message);
  }

  // Konwersja miejsc i ceny na liczby
  group.places = parseInt(group.places);
  group.price = parseInt(group.price);

  try {
    // TODO: Sprawdzenie czy grupa istnieje
    const fetchedGroup = await groupModel.getGroupById(id);
    if (!fetchedGroup) {
      return res.status(404).json({ message: "Group not found" });
    }

    // TOOD: Sprawdzenie czy nie będzie konflitku miejsc
    const takenPlaces = await groupModel.getTakenPlaces(id);
    if (group.places < takenPlaces) {
      return res.status(409).json({
        message: "Cannot set places to less than taken places",
      });
    }

    // Aktualizacja grupy w bazie
    await groupModel.updateGroup(id, group);
    res.status(200).send("Group updated");
  } catch (error) {
    console.error("Error updating group:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getGroupStudents = async (req, res) => {
  const groupId = req.params.id;

  if (!groupId) {
    return res.status(400).json({ message: "Group id is required" });
  }

  if (isNaN(groupId)) {
    return res.status(400).json({ message: "Group id must be a number" });
  }

  if (req.query.page && isNaN(req.query.page)) {
    return res.status(400).json({ message: "Page must be a number" });
  }

  if (req.query.limit && isNaN(req.query.limit)) {
    return res.status(400).json({ message: "Limit must be a number" });
  }

  // Pobranie parametrów paginacji
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const offset = (page - 1) * limit;

  try {
    // Sprawdzenie czy grupa istnieje
    const fetchedGroup = await groupModel.getGroupById(groupId);
    if (!fetchedGroup) {
      return res.status(404).json({ message: "Group not found" });
    }

    let students;
    let totalStudents;

    if (page && limit) {
      // Pobranie studentów
      students = await groupModel.getGroupStudents(groupId, limit, offset);

      // Pobranie liczby wszystkich grup
      totalStudents = await groupModel.getTakenPlaces(groupId);
    } else {
      // Pobranie wszystkich studentów
      students = await groupModel.getGroupStudents(groupId);

      // Pobranie liczby wszystkich grup
      totalStudents = students.length;
    }

    // Pobranie studentów przypisanych do grupy
    // const students = await groupModel.getGroupStudents(groupId);
    const totalPages = Math.ceil(totalStudents / limit);
    res.status(200).json({
      students,
      totalPages: totalPages > 0 ? totalPages : 1,
    });
  } catch (error) {
    console.error("Error fetching group students:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteStudentFromGroup = async (req, res) => {
  const groupId = req.params.groupId;
  const studentId = req.params.studentId;

  if (!groupId || isNaN(groupId)) {
    return res
      .status(400)
      .json({ message: "Group id is required and has to be a number" });
  }

  if (!studentId || isNaN(studentId)) {
    return res
      .status(400)
      .json({ message: "Student id is required and has to be a number" });
  }

  try {
    const fetchedGroup = await groupModel.getGroupById(groupId);
    if (!fetchedGroup) {
      return res.status(404).json({ message: "Group not found" });
    }

    const fetchedStudent = await studentModel.getStudentById(studentId);
    if (!fetchedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    const isStudentInGroup = await groupModel.isStudentInGroup(
      groupId,
      studentId
    );
    if (!isStudentInGroup) {
      return res.status(404).json({ message: "Student is not in this group" });
    }

    await groupModel.deleteStudentFromGroup(groupId, studentId);
    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting student from group:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const leaveGroup = async (req, res) => {
  const groupId = req.params.id;
  const studentId = req.userId;

  if (!groupId || isNaN(groupId)) {
    return res
      .status(400)
      .json({ message: "Group id is required and has to be a number" });
  }

  if (!studentId || isNaN(studentId)) {
    return res
      .status(400)
      .json({ message: "Student id is required and has to be a number" });
  }

  try {
    const fetchedGroup = await groupModel.getGroupById(groupId);
    if (!fetchedGroup) {
      return res.status(404).json({ message: "Group not found" });
    }

    const fetchedStudent = await studentModel.getStudentById(studentId);
    if (!fetchedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    const isStudentInGroup = await groupModel.isStudentInGroup(
      groupId,
      studentId
    );
    if (!isStudentInGroup) {
      return res.status(409).json({ message: "Student is not in this group" });
    }

    await groupModel.deleteStudentFromGroup(groupId, studentId);
    res.sendStatus(204);
  } catch (error) {
    console.error("Error leaving group:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateAbsences = async (req, res) => {
  const { groupId, studentId } = req.params;
  const { increment } = req.body;

  if (!groupId || isNaN(groupId)) {
    return res.status(400).json({ message: "Group id is required" });
  }

  if (!studentId || isNaN(studentId)) {
    return res.status(400).json({ message: "Student id is required" });
  }

  if (!increment || isNaN(increment)) {
    return res.status(400).json({ message: "Increment is required" });
  }

  try {
    const group = await groupModel.getGroupById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const student = await studentModel.getStudentById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const studentAbsences = await groupModel.getUserAbsences(
      groupId,
      studentId
    );
    if (studentAbsences === null) {
      return res.status(404).json({ message: "Student is not in this group" });
    }

    const newAbsences = studentAbsences + increment;
    if (newAbsences < 0) {
      return res.status(409).json({ message: "Absences cannot be negative" });
    }

    await groupModel.updateAbsences(groupId, studentId, newAbsences);

    res.json({ absences: newAbsences });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllGroups,
  getGroupById,
  deleteGroup,
  createGroup,
  updateGroup,
  getUserGroups,
  getAvailableGroupsForUser,
  getTeacherGroups,
  getGroupStudents,
  deleteStudentFromGroup,
  leaveGroup,
  updateAbsences,
};
