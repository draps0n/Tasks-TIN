const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const applicationRoutes = require("./routes/applicationRoutes");

const app = express();
const port = 5000;

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
app.use("/applications", applicationRoutes);

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
