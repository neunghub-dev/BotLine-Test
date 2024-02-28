const BotEvent = require("./helper/BotEvent");

const express = require("express");
const app = express();
const port = 3001;
const routes = require("./routes/index");
const db = require("./models/index");
const corsOptions = require("./config/corsOptions");
const cors = require("cors");
const cron = require("./helper/cronjob");

app.use(cors(corsOptions));
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

cron.clearRound();
cron.updateIsSelectRound();
// // app.post("/webhook", (req, res) => {

// const clearDailyOrders = cron.schedule("38 10 * * *", () => {
//   console.log("Cron job clears orders every day at 10:31");
// });

// clearDailyOrders.start();

db.sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("connect success to sync db.");
    app.listen(port, () => {
      console.log(`API is listening  on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });
