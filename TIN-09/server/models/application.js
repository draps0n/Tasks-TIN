const { openDb } = require("../config/database");

const languages = {
  eng: "Angielski",
  ger: "Niemiecki",
  fre: "Francuski",
  spa: "Hiszpański",
  ita: "Włoski",
};

class Application {
  constructor(id, fname, lname, email, lang, date) {
    this.id = id;
    this.fname = fname;
    this.lname = lname;
    this.email = email;
    this.lang = lang;
    this.date = date;
  }

  static async getAll() {
    const db = openDb();
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM Zgloszenie", [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(
            rows.map((row) => {
              return new Application(
                row.id,
                row.imie,
                row.nazwisko,
                row.email,
                row.jezyk,
                row.data
              );
            })
          );
        }

        db.close();
      });
    });
  }

  static async getById(id) {
    const db = openDb();
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM Zgloszenie WHERE id = ?", [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          if (!row) {
            resolve(null);
          } else {
            resolve(
              new Application(
                row.id,
                row.imie,
                row.nazwisko,
                row.email,
                row.jezyk,
                row.data
              )
            );
          }
        }

        db.close();
      });
    });
  }

  async save() {
    const db = openDb();
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO Zgloszenie (imie, nazwisko, email, jezyk, data) VALUES (?, ?, ?, ?, ?)",
        [
          this.fname,
          this.lname,
          this.email,
          this.lang,
          new Date(this.date).getTime() / 1000,
        ],
        function (err) {
          if (err) reject(err);
          else resolve(this.lastID);
          db.close();
        }
      );
    });
  }
}

module.exports = Application;
