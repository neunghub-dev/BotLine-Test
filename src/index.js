const BotEvent = require("./helper/BotEvent");

const express = require("express");
const app = express();
const port = 3001;
const routes = require("./routes/index");
const db = require("./models/index");

app.use(express.static("src/public"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.get("/", (req, res) => {
  res.sendStatus(200);
});

app.use("/api/v1", routes);
// // app.post("/webhook", (req, res) => {

db.sequelize
  .sync()
  .then(() => {
    console.log("connect success to sync db.");
    app.listen(port, () => {
      console.log(`API is listening  on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });
