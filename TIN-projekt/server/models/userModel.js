const { pool } = require("../db/database");

const getAllUsers = async (limit, offset) => {
  let query = `
    SELECT u.id, u.imie, u.nazwisko, u.email, u.data_urodzenia, u.rola as rolaId, r.nazwa as rola
    FROM uzytkownik u
    INNER JOIN rola r ON u.rola = r.id
    ORDER BY u.id
    `;
  const params = [];

  if (limit !== undefined && offset !== undefined) {
    query += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);
  }

  const [results] = await pool.query(query, params);

  return results.map((user) => ({
    id: user.id,
    name: user.imie,
    lastName: user.nazwisko,
    email: user.email,
    dateOfBirth: user.data_urodzenia,
    role: {
      id: user.rolaId,
      name: user.rola,
    },
  }));
};

const getTotalUsers = async () => {
  const [results] = await pool.query(
    "SELECT COUNT(*) as totalUsers FROM uzytkownik"
  );
  return results[0].totalUsers;
};

const getUserByEmail = async (email) => {
  const [results] = await pool.query(
    `
    SELECT u.id, u.imie, u.nazwisko, u.email, u.haslo, u.data_urodzenia, u.rola as rolaId, r.nazwa as rola, n.przepracowane_godziny, n.stawka_godzinowa, k.czy_rabat, k.opis, p.pensja
    FROM uzytkownik u
    INNER JOIN rola r ON u.rola = r.id
    LEFT JOIN nauczyciel n ON u.id = n.id
    LEFT JOIN kursant k ON u.id = k.id
    LEFT JOIN pracownik_administracyjny p ON u.id = p.id
    WHERE u.email = ?
    `,
    [email]
  );

  if (results.length === 0) {
    return null;
  }

  user = {
    id: results[0].id,
    name: results[0].imie,
    lastName: results[0].nazwisko,
    email: results[0].email,
    dateOfBirth: results[0].data_urodzenia,
    password: results[0].haslo,
    roleId: results[0].rolaId,
    role: results[0].rola,
    hoursWorked: results[0].przepracowane_godziny,
    hourlyRate: results[0].stawka_godzinowa,
    discount: results[0].czy_rabat !== "n",
    description: results[0].opis,
    salary: results[0].pensja,
  };

  return user;
};

const findUserById = async (id) => {
  const [results] = await pool.query(
    `
    SELECT u.id, u.imie, u.nazwisko, u.email, u.haslo, u.data_urodzenia, u.rola as rolaId, r.nazwa as rola, n.przepracowane_godziny, n.stawka_godzinowa, k.czy_rabat, k.opis, p.pensja
    FROM uzytkownik u
    INNER JOIN rola r ON u.rola = r.id
    LEFT JOIN nauczyciel n ON u.id = n.id
    LEFT JOIN kursant k ON u.id = k.id
    LEFT JOIN pracownik_administracyjny p ON u.id = p.id
    WHERE u.id = ?
    `,
    [id]
  );

  if (results.length === 0) {
    return null;
  }

  user = {
    id: results[0].id,
    name: results[0].imie,
    lastName: results[0].nazwisko,
    email: results[0].email,
    dateOfBirth: results[0].data_urodzenia,
    password: results[0].haslo,
    roleId: results[0].rolaId,
    role: results[0].rola,
    hoursWorked: results[0].przepracowane_godziny,
    hourlyRate: results[0].stawka_godzinowa,
    discount: results[0].czy_rabat !== "n",
    description: results[0].opis,
    salary: results[0].pensja,
  };

  return user;
};

const getUserById = async (id) => {
  const [results] = await pool.query("SELECT * FROM uzytkownik WHERE id = ?", [
    id,
  ]);
  if (results.length === 0) {
    return null;
  }
  const user = {
    id: results[0].id,
    name: results[0].imie,
    lastName: results[0].nazwisko,
    email: results[0].email,
    dateOfBirth: results[0].data_urodzenia,
    password: results[0].haslo,
    refreshToken: results[0].refresh_token,
    role: results[0].rola,
  };
  return user;
};

const getUserByRefreshToken = async (refreshToken) => {
  const [results] = await pool.query(
    "SELECT * FROM uzytkownik WHERE refresh_token = ?",
    [refreshToken]
  );

  if (results.length === 0) {
    return null;
  }

  const user = {
    id: results[0].id,
    name: results[0].imie,
    lastName: results[0].nazwisko,
    email: results[0].email,
    dateOfBirth: results[0].data_urodzenia,
    password: results[0].haslo,
    refreshToken: results[0].refresh_token,
    role: results[0].rola,
  };
  return user;
};

const createUser = async (user, roleId, connection) => {
  const { name, lastName, email, dateOfBirth, password } = user;

  const insertUserQuery = `
    INSERT INTO uzytkownik (imie, nazwisko, email, data_urodzenia, haslo, refresh_token, rola)
    VALUES (?, ?, ?, ?, ?, '', ?)
  `;
  const [results] = await connection.query(insertUserQuery, [
    name,
    lastName,
    email,
    dateOfBirth,
    password,
    roleId,
  ]);

  return results.insertId;
};

const updateUserRefreshToken = async (userId, refreshToken) => {
  const [results] = await pool.query(
    "UPDATE uzytkownik SET refresh_token = ? WHERE id = ?",
    [refreshToken, userId]
  );
  return results;
};

const updateUser = async (user, connection) => {
  const { id, name, lastName, email, dateOfBirth, password } = user;

  const [results] = await connection.query(
    "UPDATE uzytkownik SET imie = ?, nazwisko = ?, email = ?, data_urodzenia = ?, haslo = ? WHERE id = ?",
    [name, lastName, email, dateOfBirth, password, id]
  );

  return results;
};

const deleteUser = async (id, connection) => {
  await connection.query("DELETE FROM uzytkownik WHERE id = ?", [id]);
};

module.exports = {
  getAllUsers,
  getUserByEmail,
  getUserByRefreshToken,
  getUserById,
  createUser,
  updateUserRefreshToken,
  findUserById,
  updateUser,
  getTotalUsers,
  deleteUser,
};
