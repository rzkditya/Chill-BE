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

(async () => {
  try {
    await db.authenticate();
    console.log("Successfully connected to database using Sequelize");

    app.listen(port, () => {
      console.log(`Server is running at port ${port}`);
    });
  } catch (error) {
    console.error("Error connecting to database: ", error.message);
    process.exit(1);
  }
})();
