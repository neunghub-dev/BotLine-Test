//import helper
const BotEvent = require("../helper/BotEvent");
const usersService = require("../services/users.service");
const roundService = require("../services/round.service");

const hookMessageLine = async (req, res) => {
  try {
    if (req.body.events.length !== 0) {
      console.log(req.body.events[0]);
      const message = req.body.events[0].message.text;
      const replyToken = req.body.events[0].replyToken;
      const userId = req.body.events[0].source.userId;
      const groupId = req.body.events[0].source.groupId;

      if (userId === "Uab6dc3240000f41c68d86744421b375d") {
        if (message === "o") {
          const isRound = await roundService.checkRoundInprogress();
          if (isRound) {
            const data = {
              message: "มีรอบที่กำลังเปิดอยู่",
              replyToken: replyToken,
            };
            await BotEvent.openRound(data);
            return;
          } else {
            const date = new Date();
            const formattedDate = date.toISOString().split("T")[0].toString();
            const getRound = await roundService.getRound(formattedDate);
            const data = {
              message: getRound,
              replyToken: replyToken,
              groupId: groupId,
              userId: userId,
            };
            const round = {
              round: parseInt(getRound) + 1,
              type: "inProgress",
              isOpen: true,
              isClose: false,
              openRoundAt: new Date(),
            };
            const createRound = await roundService.createRound(round);
            if (createRound) {
              await BotEvent.openRound(data);
            }
            return;
          }
        } else if (message === "c") {
          const isRound = await roundService.checkRoundInprogress();
          if (!isRound) {
            const data = {
              message: "ไม่มีรอบที่กำลังเปิดอยู่",
              replyToken: replyToken,
            };
            await BotEvent.openRound(data);
            return;
          } else {
            const date = new Date();
            const formattedDate = date.toISOString().split("T")[0].toString();
            const round = await roundService.getRoundIdinProgress(
              formattedDate
            );
            const json = JSON.stringify(round);
            const roundItem = JSON.parse(json);
            console.log(roundItem.id);
            const updateRound = await roundService.closeRound(roundItem.id);
            if (updateRound) {
              const data = {
                message: "ปิดรอบเรียบร้อย",
                replyToken: replyToken,
              };
              await BotEvent.openRound(data);
            }
            return;
          }
        } else if (
          message.charAt(0) === "s" &&
          message.split(",").length === 7
        ) {
          const data = [
            {
              k0: 29,
              isWinner: false,
            },
            {
              k1: 11,
              isWinner: false,
            },
            {
              k2: 19,
              isWinner: false,
            },
            {
              k3: 18,
              isWinner: false,
            },
            {
              k4: 28,
              isWinner: false,
            },
            {
              k5: 22,
              isWinner: false,
            },
            {
              k6: 12,
              isWinner: false,
            },
          ];
          const ress = [
            29, 19, 28, 18, 27.5, 17.5, 17, 16, 15, 14, 13, 22, 12, 11, 0,
          ];

          // console.log(message);
        }
      }
      if (message === "เช็คยอด" || message === "check") {
        const val = await usersService.getCreadit(userId);
        const credit = val.credit;

        const user = await BotEvent.getProfileInGroupById(groupId, userId);
        const data = {
          name: user.data.displayName,
          replyToken: replyToken,
          credit: credit,
        };

        await BotEvent.getCreadit(data);
      }
    } else {
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
