const express = require("express");
const app = express();
const port = 8080;
const languages = {
  eng: "Angielski",
  ger: "Niemiecki",
  fre: "Francuski",
  spa: "Hiszpański",
  ita: "Włoski",
};

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.redirect("/form");
});

app.get("/form", (req, res) => {
  res.sendFile(__dirname + "/public/form.html");
});

app.post("/submit", (req, res) => {
  const jsonData = req.body;
  res.render("submit", {
    fname: jsonData.fname,
    lname: jsonData.lname,
    email: jsonData.email,
    lang: languages[jsonData.lang],
    date: jsonData.date,
  });
});

app.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}`);
});
