const { pool } = require("../db/database");

const addNewApplication = async (application) => {
  const [results] = await pool.query(
    `INSERT INTO zgloszenie (kursant, grupa, data_rozpoczecia, uwagi, data_przeslania, status)
        VALUES (?, ?, ?, ?, NOW(), ?)`,
    [
      application.studentId,
      application.groupId,
      application.startDate,
      application.comment,
      application.state,
    ]
  );

  return results;
};

const deleteApplication = async (id) => {
  await pool.query(`DELETE FROM zgloszenie WHERE id = ?`, [id]);
};

const deleteApplicationByGroupId = async (groupId, connection) => {
  await connection.query(`DELETE FROM zgloszenie WHERE grupa = ?`, [groupId]);
};

const getAllApplications = async (limit, offset) => {
  const [results] = await pool.query(
    `
    SELECT z.id, z.grupa as grupaId, z.data_rozpoczecia as dataRozpoczecia, z.uwagi, z.data_przeslania as dataPrzeslania, z.wiadomosc_zwrotna, sz.id as statusId, sz.nazwa as 'status', j.id as jezykId, j.nazwa as jezyk, j.skrot, pj.id as poziomId, pj.nazwa as poziom, u.id as kursantId, u.imie as kursantImie, u.nazwisko as kursantNazwisko, u.email as kursantEmail
    FROM zgloszenie z
    INNER JOIN grupa g ON z.grupa = g.id
    INNER JOIN status_zgloszenia sz ON z.status = sz.id
    INNER JOIN jezyk j ON g.jezyk = j.id
    INNER JOIN poziom_jezyka pj ON g.poziom = pj.id
    INNER JOIN uzytkownik u ON z.kursant = u.id
    ORDER BY z.data_przeslania DESC
    LIMIT ?
    OFFSET ?;
    `,
    [limit, offset]
  );
  return results.map((application) => ({
    id: application.id,
    groupId: application.grupaId,
    startDate: application.dataRozpoczecia,
    comment: application.uwagi,
    sentDate: application.dataPrzeslania,
    feedbackMessage: application.wiadomosc_zwrotna,
    status: {
      id: application.statusId,
      name: application.status,
    },
    language: {
      id: application.jezykId,
      name: application.jezyk,
      code: application.skrot,
    },
    level: {
      id: application.poziomId,
      name: application.poziom,
    },
    student: {
      id: application.kursantId,
      name: application.kursantImie,
      lastName: application.kursantNazwisko,
      email: application.kursantEmail,
    },
  }));
};

const getApplicationsForGroup = async (groupId, limit, offset) => {
  const [results] = await pool.query(
    `
    SELECT z.id, z.grupa as grupaId, z.data_rozpoczecia as dataRozpoczecia, z.uwagi, z.data_przeslania as dataPrzeslania, z.wiadomosc_zwrotna, sz.id as statusId, sz.nazwa as 'status', j.id as jezykId, j.nazwa as jezyk, j.skrot, pj.id as poziomId, pj.nazwa as poziom, u.id as kursantId, u.imie as kursantImie, u.nazwisko as kursantNazwisko, u.email as kursantEmail
    FROM zgloszenie z
    INNER JOIN grupa g ON z.grupa = g.id
    INNER JOIN status_zgloszenia sz ON z.status = sz.id
    INNER JOIN jezyk j ON g.jezyk = j.id
    INNER JOIN poziom_jezyka pj ON g.poziom = pj.id
    INNER JOIN uzytkownik u ON z.kursant = u.id
    WHERE g.id = ?
    ORDER BY z.data_przeslania DESC
    LIMIT ?
    OFFSET ?;
    `,
    [groupId, limit, offset]
  );
  return results.map((application) => ({
    id: application.id,
    groupId: application.grupaId,
    startDate: application.dataRozpoczecia,
    comment: application.uwagi,
    sentDate: application.dataPrzeslania,
    feedbackMessage: application.wiadomosc_zwrotna,
    status: {
      id: application.statusId,
      name: application.status,
    },
    language: {
      id: application.jezykId,
      name: application.jezyk,
      code: application.skrot,
    },
    level: {
      id: application.poziomId,
      name: application.poziom,
    },
    student: {
      id: application.kursantId,
      name: application.kursantImie,
      lastName: application.kursantNazwisko,
      email: application.kursantEmail,
    },
  }));
};

const getUserApplications = async (userId, limit, offset) => {
  const [results] = await pool.query(
    `
    SELECT z.id, z.grupa as grupaId, z.data_rozpoczecia as dataRozpoczecia, z.uwagi, z.data_przeslania as dataPrzeslania, z.wiadomosc_zwrotna, sz.id as statusId, sz.nazwa as 'status', j.id as jezykId, j.nazwa as jezyk, j.skrot, pj.id as poziomId, pj.nazwa as poziom, u.id as kursantId, u.imie as kursantImie, u.nazwisko as kursantNazwisko, u.email as kursantEmail
    FROM zgloszenie z
    INNER JOIN grupa g ON z.grupa = g.id
    INNER JOIN status_zgloszenia sz ON z.status = sz.id
    INNER JOIN jezyk j ON g.jezyk = j.id
    INNER JOIN poziom_jezyka pj ON g.poziom = pj.id
    INNER JOIN uzytkownik u ON z.kursant = u.id
    WHERE z.kursant = ?
    ORDER BY z.data_przeslania DESC
    LIMIT ?
    OFFSET ?;
    `,
    [userId, limit, offset]
  );
  return results.map((application) => ({
    id: application.id,
    groupId: application.grupaId,
    startDate: application.dataRozpoczecia,
    comment: application.uwagi,
    sentDate: application.dataPrzeslania,
    feedbackMessage: application.wiadomosc_zwrotna,
    status: {
      id: application.statusId,
      name: application.status,
    },
    language: {
      id: application.jezykId,
      name: application.jezyk,
      code: application.skrot,
    },
    level: {
      id: application.poziomId,
      name: application.poziom,
    },
    student: {
      id: application.kursantId,
      name: application.kursantImie,
      lastName: application.kursantNazwisko,
      email: application.kursantEmail,
    },
  }));
};

const getUserApplicationsToGroup = async (userId, groupId, limit, offset) => {
  const [results] = await pool.query(
    `
    SELECT z.id, z.grupa as grupaId, z.data_rozpoczecia as dataRozpoczecia, z.uwagi, z.data_przeslania as dataPrzeslania, z.wiadomosc_zwrotna, sz.id as statusId, sz.nazwa as 'status', j.id as jezykId, j.nazwa as jezyk, j.skrot, pj.id as poziomId, pj.nazwa as poziom, u.id as kursantId, u.imie as kursantImie, u.nazwisko as kursantNazwisko, u.email as kursantEmail
    FROM zgloszenie z
    INNER JOIN grupa g ON z.grupa = g.id
    INNER JOIN status_zgloszenia sz ON z.status = sz.id
    INNER JOIN jezyk j ON g.jezyk = j.id
    INNER JOIN poziom_jezyka pj ON g.poziom = pj.id
    INNER JOIN uzytkownik u ON z.kursant = u.id
    WHERE z.kursant = ? AND z.grupa = ?
    ORDER BY z.data_przeslania DESC
    LIMIT ?
    OFFSET ?;
    `,
    [userId, groupId, limit, offset]
  );
  return results.map((application) => ({
    id: application.id,
    groupId: application.grupaId,
    startDate: application.dataRozpoczecia,
    comment: application.uwagi,
    sentDate: application.dataPrzeslania,
    feedbackMessage: application.wiadomosc_zwrotna,
    status: {
      id: application.statusId,
      name: application.status,
    },
    language: {
      id: application.jezykId,
      name: application.jezyk,
      code: application.skrot,
    },
    level: {
      id: application.poziomId,
      name: application.poziom,
    },
    student: {
      id: application.kursantId,
      name: application.kursantImie,
      lastName: application.kursantNazwisko,
      email: application.kursantEmail,
    },
  }));
};

const getTotalApplications = async () => {
  const [results] = await pool.query(
    `SELECT COUNT(*) as totalApplications FROM zgloszenie`
  );

  return results[0].totalApplications;
};

const getTotalApplicationsForGroup = async (groupId) => {
  const [results] = await pool.query(
    `SELECT COUNT(*) as totalApplications FROM zgloszenie WHERE grupa = ?`,
    [groupId]
  );

  return results[0].totalApplications;
};

const getTotalUserApplications = async (userId) => {
  const [results] = await pool.query(
    `SELECT COUNT(*) as totalApplications FROM zgloszenie WHERE kursant = ?`,
    [userId]
  );

  return results[0].totalApplications;
};

const getTotalUserApplicationsToGroup = async (userId, groupId) => {
  const [results] = await pool.query(
    `SELECT COUNT(*) as totalApplications FROM zgloszenie WHERE kursant = ? AND grupa = ?`,
    [userId, groupId]
  );

  return results[0].totalApplications;
};

const getApplicationById = async (id) => {
  const [results] = await pool.query(`SELECT * FROM zgloszenie WHERE id = ?`, [
    id,
  ]);

  if (results.length === 0) {
    return null;
  }

  return {
    id: results[0].id,
    studentId: results[0].kursant,
    groupId: results[0].grupa,
    startDate: results[0].data_rozpoczecia,
    comment: results[0].uwagi,
    sentDate: results[0].data_przeslania,
    feedbackMessage: results[0].wiadomosc_zwrotna,
    employeeId: results[0].pracownik_rozpatrujacy,
    status: results[0].status,
  };
};

const updateApplicationByUser = async (application) => {
  await pool.query(
    `
    UPDATE zgloszenie
    SET data_rozpoczecia = ?, uwagi = ?, grupa = ?
    WHERE id = ?
    `,
    [
      application.startDate,
      application.comment,
      application.groupId,
      application.id,
    ]
  );
};

const updateApplicationByEmployee = async (application, connection) => {
  await connection.query(
    `
    UPDATE zgloszenie
    SET status = ?, wiadomosc_zwrotna = ?, pracownik_rozpatrujacy = ?
    WHERE id = ?
    `,
    [
      application.status,
      application.feedbackMessage,
      application.employeeId,
      application.id,
    ]
  );
};

const getApplicationEditableDataById = async (id) => {
  const [results] = await pool.query(
    `SELECT grupa, data_rozpoczecia, uwagi FROM zgloszenie WHERE id = ?`,
    [id]
  );

  return {
    groupId: results[0].grupa,
    startDate: results[0].data_rozpoczecia,
    comment: results[0].uwagi,
  };
};

const updateApplicationsByEmployeeId = async (employeeId, connection) => {
  await connection.query(
    `UPDATE zgloszenie SET pracownik_rozpatrujacy = NULL WHERE pracownik_rozpatrujacy = ?`,
    [employeeId]
  );
};

const deleteApplicationsByStudentId = async (studentId, connection) => {
  await connection.query(`DELETE FROM zgloszenie WHERE kursant = ?`, [
    studentId,
  ]);
};

module.exports = {
  addNewApplication,
  deleteApplication,
  deleteApplicationByGroupId,
  getAllApplications,
  getUserApplications,
  getTotalApplications,
  getTotalUserApplications,
  getApplicationById,
  updateApplicationByUser,
  updateApplicationByEmployee,
  getApplicationEditableDataById,
  updateApplicationsByEmployeeId,
  deleteApplicationsByStudentId,
  getApplicationsForGroup,
  getTotalApplicationsForGroup,
  getTotalUserApplicationsToGroup,
  getUserApplicationsToGroup,
};
