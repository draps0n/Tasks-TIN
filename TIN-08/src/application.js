const languages = {
  eng: "Angielski",
  ger: "Niemiecki",
  fre: "Francuski",
  spa: "Hiszpański",
  ita: "Włoski",
};

class Application {
  constructor(id, lname, nazwisko, email, lang, date) {
    this.id = id;
    this.fname = lname;
    this.lname = nazwisko;
    this.email = email;
    this.lang = lang;
    this.date = new Date(date * 1000);
  }

  get language() {
    return languages[this.lang];
  }

  get formattedDate() {
    return this.date.toLocaleDateString("pl-PL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
}

export default Application;
