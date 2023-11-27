//import helper
const BotEvent = require("../helper/BotEvent");
const usersService = require("../services/users.service");
const roundService = require("../services/round.service");
const transactionService = require("../services/transaction.service");
let results = [];
let mssageTotal = "";

const hookMessageLine = async (req, res) => {
  try {
    if (req.body.events.length !== 0) {
      console.log(req.body.events[0]);
      const message = req.body.events[0].message.text;
      const replyToken = req.body.events[0].replyToken;
      const userId = req.body.events[0].source.userId;
      const groupId = req.body.events[0].source.groupId;

      //check ว่าเปิดรอบไหม
      //update เงิน
      //บันทึกข้อมูล
      try {
        if (
          message === "เช็คยอด" ||
          message === "check" ||
          message === "Check"
        ) {
          const val = await usersService.getCreaditByuserId(userId);
          const credit = val.credit;

          const user = await BotEvent.getProfileInGroupById(groupId, userId);
          const data = {
            name: user.data.displayName,
            replyToken: replyToken,
            credit: credit,
          };

          await BotEvent.getCreadit(data);
        } else {
          const searchRegex = /[=\/]/g; // This regex matches '=' or '/' globally
          const matches = message.match(searchRegex) ?? [];
          console.log(matches);

          if (matches.length > 0) {
            const round = await roundService.getCountRoundInProgress(groupId);
            const isRound = await roundService.getRoundIdinProgress(groupId);
            if (round === 1) {
              const id = await usersService.getIdByUUid(userId);
              const resultArray = message.split("\n");
              const resultObjects = [];
              let total = 0;
              resultArray.forEach((item) => {
                const [, key, value] = item.match(/(\d+)\/(\d+)/);
                const obj = {
                  name: "k" + key,
                  unit: parseInt(value, 10),
                };
                resultObjects.push(obj);
              });

              // const msg = message.split("/");
              // console.log(msg);

              const data = [
                {
                  name: "k1",
                  unit: 0,
                  balance: 0,
                  isDeduction: false,
                },
                {
                  name: "k2",
                  unit: 0,
                  balance: 0,
                  isDeduction: false,
                },
                {
                  name: "k3",
                  unit: 0,
                  balance: 0,
                  isDeduction: false,
                },
                {
                  name: "k4",
                  unit: 0,
                  balance: 0,
                  isDeduction: false,
                },
                {
                  name: "k5",
                  unit: 0,
                  balance: 0,
                  isDeduction: false,
                },
                {
                  name: "k6",
                  unit: 0,
                  balance: 0,
                  isDeduction: false,
                },
              ];
              let check2000 = false;
              if (resultObjects.length > 0) {
                resultObjects.forEach((item) => {
                  data.forEach((item2) => {
                    if (item.name === item2.name) {
                      if (item.unit > 2000) {
                        check2000 = true;
                      }
                      item2.unit = item.unit;
                    }
                  });
                });
              }
              console.log(check2000);
              if (check2000) {
                BotEvent.replyMessage(replyToken, {
                  type: "text",
                  text: "ไม่สามารถเดิมพันได้เกิน 2000 บาท/ขา",
                });
                check2000 = false;
                return;
              }

              const allUnitsNotZero = data.every((item) => item.unit === 0);

              // console.log(`คงเหลือ ${credit} บ.`);

              let msgString = "";
              if (!allUnitsNotZero) {
                const user = await BotEvent.getProfileInGroupById(
                  groupId,
                  userId
                );
                msgString += `👤 คุณ ${user.data.displayName}\n`;
                data.map((item) => {
                  if (item.unit !== 0) {
                    total += item.unit;
                    msgString += `✅ ขา ${item.name.charAt(1)} = ${
                      item.unit
                    } บ.\n`;
                  }
                });

                const val = await usersService.getCreaditByuserId(userId);
                let isCheck = false;
                console.log(total);
                if (val.credit > total * 2) {
                  total = total * 2;
                  data.forEach((item) => {
                    item.isDeduction = true;
                  });
                } else if (val.credit >= total) {
                  total = total;
                  data.forEach((item) => {
                    item.isDeduction = false;
                  });
                } else {
                  isCheck = true;
                  BotEvent.replyMessage(replyToken, {
                    type: "text",
                    text: "ยอดเงินไม่พอ",
                  });
                  return;
                }

                //เหลือ Update Credit

                msgString += `\nหักล่วงหน้า ${total} บ.\n`;
                msgString += `คงเหลือ ${val.credit - total} บ.`;

                //save RoundDetail
                if (!isCheck) {
                  if (id) {
                    const saveData = data.filter((item) => item.unit !== 0);
                    const roundDetailData = [];
                    saveData.forEach((item) => {
                      const obj = {
                        roundId: isRound.id,
                        userId: id.id,
                        ka: item.name,
                        unit: parseInt(item.unit),
                        isDeduction: item.isDeduction,
                      };
                      roundDetailData.push(obj);
                    });
                    const addRoundDetail = await roundService.createRoundDetail(
                      roundDetailData
                    );
                    const updateCredit = usersService.updateCredit(
                      val.credit - total,
                      userId
                    );

                    const transactionData = {
                      event: "play",
                      unit: total,
                      userId: parseInt(id.id),
                      adminId: 2,
                    };
                    const createTransaction =
                      transactionService.createTransaction(transactionData);

                    if (updateCredit && createTransaction && addRoundDetail) {
                      BotEvent.replyMessage(replyToken, {
                        type: "text",
                        text: msgString,
                      });
                    }
                  } else {
                    BotEvent.replyMessage(replyToken, {
                      type: "text",
                      text: "ไม่พบข้อมูลผู้ใช้",
                    });
                  }
                }
              }
            } else {
              BotEvent.replyMessage(replyToken, {
                type: "text",
                text: "ไม่มีรอบที่กำลังเปิดอยู่",
              });
            }
          }
        }
      } catch (error) {
        console.log(error);
        return;
      }
      if (userId === "Uab6dc3240000f41c68d86744421b375d") {
        if (message === "o") {
          const isRound = await roundService.checkRoundInprogress(groupId);
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
            const getRound = await roundService.getRound(groupId);
            console.log(getRound);
            const data = {
              message: parseInt(getRound) + 1,
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
              groupId: groupId,
            };
            const createRound = await roundService.createRound(round);
            if (createRound) {
              await BotEvent.openRound(data);
            }
            return;
          }
        } else if (message === "c") {
          const isRound = await roundService.getRoundIdinProgress(groupId);
          if (isRound === 0) {
            const data = {
              message: "ไม่มีรอบที่กำลังเปิดอยู่",
              replyToken: replyToken,
            };
            await BotEvent.openRound(data);
            return;
          } else {
            const date = new Date();
            const formattedDate = date.toISOString().split("T")[0].toString();
            const round = await roundService.getRoundIdinProgress(groupId);
            const json = JSON.stringify(round);
            const roundItem = JSON.parse(json);
            const updateRound = await roundService.closeRound(
              roundItem.id,
              groupId
            );
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
          const round = await roundService.getRoundIdinProgress(groupId);
          const isRound = await roundService.getCountRoundInProAndclose(
            groupId
          );
          if (isRound === 1) {
            const result = message.split(",");
            const transformedSequence = result.map((number, index) => ({
              name: `k${index}`,
              nameTxt:
                index === 0
                  ? `ขาเจ้า = ${
                      number.charAt(0) === "s"
                        ? convertPokTxt(number.slice(1))
                        : convertPokTxt(number)
                    }`
                  : `ขา${index} = ${
                      number.charAt(0) === "s"
                        ? convertPokTxt(number.slice(1))
                        : convertPokTxt(number)
                    }`,
              number:
                number.charAt(0) === "s"
                  ? convertPokNumber(number.slice(1))
                  : convertPokNumber(number),
              textNumber:
                number.charAt(0) === "s"
                  ? convertPokTxt(number.slice(1))
                  : convertPokTxt(number),
            }));

            const detail = await roundService.getAllRoundDetailByRoundId(
              round.id
            );
            const json = JSON.stringify(detail);
            const detailItem = JSON.parse(json);
            console.log(detailItem);
            mssageTotal = await calculate(
              transformedSequence,
              detailItem,
              groupId,
              replyToken
            );

            await BotEvent.showResult(replyToken, transformedSequence);
          } else {
            BotEvent.replyMessage(replyToken, {
              type: "text",
              text: "กรุณาปิดรอบก่อนสรุปผล",
            });
          }
        } else if (message === "show") {
          await BotEvent.replyMessage(replyToken, {
            type: "text",
            text: mssageTotal,
          });
        } else if (message === "y") {
          const round = await roundService.getRoundIdinProgress(groupId);
          if (results.length !== 0) {
            for (const item of results) {
              const user = await usersService.getCreadit(item.id);
              const newCredit = user.credit + item.total;
              await usersService.addCredit(newCredit, item.id);
            }
            const close = await roundService.closeStatus(round.id, groupId);
            if (close) {
              results = [];
              messageTotal = "";
              BotEvent.replyMessage(replyToken, {
                type: "text",
                text: "อัพเดทยอดเรียบร้อย",
              });
            }
          } else {
            await roundService.closeStatus(round.id, groupId);
            results = [];
            messageTotal = "";
          }

          // if (updateCredit) {
          //   results = [];
          //   console.log("success");
          // }
          // console.log(JSON.stringify(results, null, 2));
        }
      }
    }
  } catch (error) {
    console.log(error);
    return;
  }
  res.sendStatus(200);
};

const calculate = async (res, detail, groupId, replyToken) => {
  const transformedData = res.map((item) => ({
    name: item.name,
    number: item.number,
    isLeader: item.name === "k0",
    status: "",
    isPok: false,
  }));

  console.log(transformedData);

  let isWinnerExists = false;

  for (const item of transformedData) {
    if (!item.isLeader) {
      if (item.number > transformedData[0].number) {
        item.status = "winner";
        console.log(item.number);
        if (
          item.number === 999 ||
          item.number === 997 ||
          item.number === 995 ||
          item.number === 987
        ) {
          item.isPok = true;
        }
        console.log(item.isPok);
      } else if (item.number === transformedData[0].number) {
        item.status = "draw";
      } else {
        if (
          transformedData[0].number === 999 ||
          transformedData[0].number === 997 ||
          transformedData[0].number === 995 ||
          transformedData[0].number === 987
        ) {
          item.isPok = true;
        }
        item.status = "loser";
      }
    } else {
      continue;
    }
  }

  console.log(transformedData);

  results = convertArray(detail, groupId, replyToken);
  console.log(JSON.stringify(results, null, 2));
  transformedData.forEach((e) => {
    results.forEach((item) => {
      item.play.forEach((play) => {
        if (e.name === play.name) {
          if (e.status === "winner") {
            if (e.isPok === true) {
              if (play.isDeduction) {
                play.balance = play.unit * 2 * 2;
                item.total += play.balance;
              } else {
                play.balance = play.unit * 2;
                item.total += play.balance;
              }
            } else {
              play.balance = play.unit * 2;
              item.total += play.balance;
            }
          } else if (e.status === "loser") {
            if (e.isPok === true) {
              if (play.isDeduction) {
                play.balance = 0;
                item.total += play.balance;
              } else {
                play.balance = play.unit * 1;
                item.total += play.balance;
              }
            } else {
              if (play.isDeduction) {
                play.balance = play.unit * 1;
                item.total += play.balance;
              } else {
                play.balance = 0;
                item.total += play.balance;
              }
              // if (e.isPok === true) {
              //   if (play.isDeduction) {
              //     play.balance = (play.unit * 2) / 2;
              //     item.total += play.balance;
              //   } else {
              //     play.balance = 0;
              //     item.total += play.balance;
              //   }
              // }
            }
          } else {
            if (play.isDeduction) {
              play.balance = play.unit * 2;
              item.total += play.balance;
            } else {
              play.balance = play.unit * 1;
              item.total += play.balance;
            }
          }
        }
      });
    });
  });
  console.log(JSON.stringify(results, null, 2));

  let msgStringRes = "";
  // async function formatAsText(obj) {
  //   const userLine = await BotEvent.getProfileInGroupById(groupId, obj.uuid);
  //   return ();
  // }

  for (const item of results) {
    const userLine = await BotEvent.getProfileInGroupById(groupId, item.uuid);
    msgStringRes += `ชื่อ = ${userLine.data.displayName} ยอดรวม = ${
      item.total > item.unit ? `${item.total}` : `${item.unit}` + "\n"
    }`;
  }

  return msgStringRes;
  console.log(msgStringRes);
  console.log(replyToken);
  // await BotEvent.replyMessage(replyToken, {
  //   type: "text",
  //   text: msgStringRes,
  // });
};
const convertPokNumber = (data) => {
  let pok = "";

  if (data === "29") {
    pok = 999;
  } else if (data === "19") {
    pok = 998;
  } else if (data === "28") {
    pok = 997;
  } else if (data === "18") {
    pok = 996;
  } else if (data === "27.5") {
    pok = 995;
  } else if (data === "17.5") {
    pok = 994;
  } else if (data === "17") {
    pok = 993;
  } else if (data === "16") {
    pok = 992;
  } else if (data === "15") {
    pok = 991;
  } else if (data === "14") {
    pok = 990;
  } else if (data === "13") {
    pok = 989;
  } else if (data === "22") {
    pok = 987;
  } else if (data === "12") {
    pok = 986;
  } else if (data === "11") {
    pok = 985;
  } else {
    pok = 984;
  }

  return pok;
};

const convertPokTxt = (data) => {
  let pok = "";

  if (data === "29") {
    pok = "ป๊อก9เด้ง";
  } else if (data === "19") {
    pok = "ป๊อก9";
  } else if (data === "28") {
    pok = "ป๊อก8เด้ง";
  } else if (data === "18") {
    pok = "ป๊อก8";
  } else if (data === "27.5") {
    pok = "7.5แต้มเด้ง";
  } else if (data === "17.5") {
    pok = "7.5แต้ม";
  } else if (data === "17") {
    pok = "7แต้ม";
  } else if (data === "16") {
    pok = "6แต้ม";
  } else if (data === "15") {
    pok = "5แต้ม";
  } else if (data === "14") {
    pok = "4แต้ม";
  } else if (data === "13") {
    pok = "3แต้ม";
  } else if (data === "22") {
    pok = "2แต้มเด้ง";
  } else if (data === "12") {
    pok = "2แต้ม";
  } else if (data === "11") {
    pok = "1แต้ม";
  } else {
    pok = "บอด";
  }

  return pok;
};

function convertArray(inputArray, groupId, replyToken) {
  const outputArray = [];

  inputArray.forEach((item) => {
    const existingObject = outputArray.find((obj) => obj.id === item.userId);

    if (existingObject) {
      const playIndex = existingObject.play.findIndex(
        (playItem) => playItem.name === item.ka
      );

      if (playIndex !== -1) {
        existingObject.play[playIndex].unit += item.unit;
        existingObject.play[playIndex].isDeduction = item.isDeduction;
      }
    } else {
      const newObject = {
        id: item.userId,
        uuid: item.User.uuid_line,
        play: [
          { name: "k1", unit: 0, balance: 0, isDeduction: false },
          { name: "k2", unit: 0, balance: 0, isDeduction: false },
          { name: "k3", unit: 0, balance: 0, isDeduction: false },
          { name: "k4", unit: 0, balance: 0, isDeduction: false },
          { name: "k5", unit: 0, balance: 0, isDeduction: false },
          { name: "k6", unit: 0, balance: 0, isDeduction: false },
        ],
        unit: 0,
        total: 0,
      };

      const playIndex = newObject.play.findIndex(
        (playItem) => playItem.name === item.ka
      );
      if (playIndex !== -1) {
        newObject.play[playIndex].unit += item.unit;
        newObject.play[playIndex].isDeduction = item.isDeduction;
      }

      outputArray.push(newObject);
    }
  });
  outputArray.forEach((obj) => {
    obj.unit = obj.play.reduce((sum, playItem) => sum + playItem.unit, 0);
  });
  return outputArray;
}

module.exports = {
  hookMessageLine,
};
