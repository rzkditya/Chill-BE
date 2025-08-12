require("dotenv").config();

const express = require("express");
const db = require("./src/configs/db");

const app = express();

const port = process.env.PORT || "3000";

app.use(express.json());

app.use("/api", require("./src/routes"));

app.use("/health", (req, res) => {
  res.send({ message: "OK" });
});

app.listen(port, () => {
  db.query("SELECT 1");
  console.log(`Server is starting at ${port}`);
});
