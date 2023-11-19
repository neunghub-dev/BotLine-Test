//import helper
const BotEvent = require("../helper/BotEvent");

const hookMessageLine = async (req, res) => {
  try {
    if (req.body.events.length !== 0) {
      const message = req.body.events[0].message.text;
      const replyToken = req.body.events[0].replyToken;
      const userId = req.body.events[0].source.userId;
      const groupId = req.body.events[0].source.groupId;
      const data = {
        message: message,
        replyToken: replyToken,
        groupId: groupId,
        userId: userId,
      };
      BotEvent.openRound(data);
      console.log(data);
    } else {
      console.log(req.body);
      console.log("No message");
    }
  } catch (error) {
    console.log(error);
    return;
  }
  res.sendStatus(200);
};

module.exports = {
  hookMessageLine,
};
