const { openDb } = require("../config/database");

const languages = {
  ang: "Angielski",
  ger: "Niemiecki",
  fre: "Francuski",
  spa: "Hiszpański",
  ita: "Włoski",
};

class Application {
  constructor(lname, nazwisko, email, lang, date) {
    this.fname = lname;
    this.lname = nazwisko;
    this.email = email;
    this.lang = lang;
    this.date = new Date(date * 1000);
  }

  get language() {
    return languages[this.lang];
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
        (err) => {
          if (err) reject(err);
          else resolve();
          db.close();
        }
      );
    });
  }
}

module.exports = Application;
