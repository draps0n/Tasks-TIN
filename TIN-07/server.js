const express = require("express");
const path = require("path");
const applicationRoutes = require("./routes/applicationRoutes");

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("html", require("ejs").renderFile);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use("/applications", applicationRoutes);

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
