const sqlite3 = require("sqlite3").verbose();

function openDb() {
  return new sqlite3.Database("applications.db");
}

module.exports = { openDb };
