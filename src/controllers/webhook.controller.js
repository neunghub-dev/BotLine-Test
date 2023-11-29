//import helper
const BotEvent = require("../helper/BotEvent");
const usersService = require("../services/users.service");
const roundService = require("../services/round.service");
const transactionService = require("../services/transaction.service");
const flex = require("../constants/flexMesaage");

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
          message === "c" ||
          message === "C" ||
          message === "Check"
        ) {
          const val = await usersService.getCreaditByuserId(userId);
          const credit = val.credit;

          const user = await BotEvent.getProfileInGroupById(groupId, userId);
          const data = {
            name: user.data.displayName,
            replyToken: replyToken,
            credit: credit.toLocaleString(),
          };

          await BotEvent.getCreadit(data);
        } else if (message === "x") {
          const round = await roundService.getCountRoundInProgress(groupId);
          console.log(`round ${round}`);
          const isRound = await roundService.getRoundIdinProgress(groupId);
          if (round > 0) {
            const id = await usersService.getIdByUUid(userId);

            const tempData =
              await roundService.getAllRoundDetailByRoundIdAndUserId(
                isRound.id,
                id.id
              );
            // convert tempData to json
            const json = JSON.stringify(tempData);
            const detailItem = JSON.parse(json);
            let total = 0;
            const deleteId = [];
            detailItem.forEach((item) => {
              deleteId.push(item.id);
              if (item.isDeduction) {
                total += item.unit * 2;
              } else {
                total += item.unit;
              }
            });

            let msgString = "";
            const user = await BotEvent.getProfileInGroupById(groupId, userId);
            msgString += `👤 คุณ ${user.data.displayName}\n\n`;
            const val = await usersService.getCreaditByuserId(userId);
            if (total > 0) {
              msgString += `❌ ยกเลิกของรอบ ${isRound.round}\n`;
              msgString += `➡️ คืนเงิน ${total} บ.\n`;
              msgString += `💵 คงเหลือ ${val.credit + total} บ.\n`;
            } else {
              msgString += `คุณไม่มียอดแทงในรอบ ${isRound.round}\n`;
            }

            const update = await roundService.updateRoundDetail(deleteId);

            const updateCredit = usersService.updateCredit(
              val.credit + total,
              userId
            );
            if (update && updateCredit) {
              BotEvent.replyMessage(replyToken, {
                type: "text",
                text: msgString,
              });
            }

            return;

            // resultObjects.map((item) => {
            //   total += item.unit;
            //   console.log(total);
            //   msgString += `✅ ขา ${item.name.charAt(1)} = ${item.unit} บ.\n`;
            // });

            // BotEvent.replyMessage(replyToken, {
            //   type: "text",
            //   text: msgString,
            // });
          }
        } else {
          const searchRegex = /[=\/]/g; // This regex matches '=' or '/' globally
          const matches = message.match(searchRegex) ?? [];

          if (matches.length > 0) {
            const round = await roundService.getCountRoundInProgress(groupId);
            console.log(`round ${round}`);
            const isRound = await roundService.getRoundIdinProgress(groupId);
            if (round > 0) {
              const id = await usersService.getIdByUUid(userId);
              const resultArray = message.split("\n");
              const resultObjects = [];
              let total = 0;
              //ยอดที่รับมา
              resultArray.forEach((item) => {
                const [, key, value] = item.match(/(\d+)\/(\d+)/);
                const obj = {
                  name: "k" + key,
                  unit: parseInt(value, 10),
                };
                resultObjects.push(obj);
              });

              //ยอดเก่า -->
              const oldData = [
                { name: "k1", unit: 0 },
                { name: "k2", unit: 0 },
                { name: "k3", unit: 0 },
                { name: "k4", unit: 0 },
                { name: "k5", unit: 0 },
                { name: "k6", unit: 0 },
              ];
              const tempOldData = [
                { name: "k1", unit: 0, isAdd: false },
                { name: "k2", unit: 0, isAdd: false },
                { name: "k3", unit: 0, isAdd: false },
                { name: "k4", unit: 0, isAdd: false },
                { name: "k5", unit: 0, isAdd: false },
                { name: "k6", unit: 0, isAdd: false },
              ];
              const tempData =
                await roundService.getAllRoundDetailByRoundIdAndUserId(
                  isRound.id,
                  id.id
                );
              // convert tempData to json
              const json = JSON.stringify(tempData);
              const detailItem = JSON.parse(json);
              console.log(detailItem);
              if (detailItem.length !== 0) {
                oldData.forEach((item2) => {
                  detailItem.forEach((item) => {
                    if (item2.name === item.ka) {
                      parseInt((item2.unit += item.unit));
                    }
                  });
                });
              }
              tempOldData.forEach((item2) => {
                detailItem.forEach((item) => {
                  if (item2.name === item.ka) {
                    parseInt((item2.unit += item.unit));
                  }
                });
              });

              let tempTotal = 0;
              //ยอดเก่า <--
              // check ยอดรวมกันถึง 2000 บาทไหม -->
              let check2000 = false;
              if (resultObjects.length > 0) {
                oldData.forEach((item1, index1) => {
                  const matchingItem = resultObjects.find(
                    (item2) => item2.name === item1.name
                  );
                  let x = 0;
                  if (matchingItem) {
                    x = oldData[index1].unit += matchingItem.unit;
                    if (x > 2000) {
                      check2000 = true;
                    }
                  }
                });
              }

              if (check2000) {
                BotEvent.replyMessage(replyToken, {
                  type: "text",
                  text: "ไม่สามารถเดิมพันได้เกิน 2000 บาท/ขา",
                });
                check2000 = false;
                return;
              }
              // check ยอดรวมกันถึง 2000 บาทไหม <--

              //

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
                {
                  name: "k1",
                  unit: 0,
                  balance: 0,
                  isDeduction: true,
                },
                {
                  name: "k2",
                  unit: 0,
                  balance: 0,
                  isDeduction: true,
                },
                {
                  name: "k3",
                  unit: 0,
                  balance: 0,
                  isDeduction: true,
                },
                {
                  name: "k4",
                  unit: 0,
                  balance: 0,
                  isDeduction: true,
                },
                {
                  name: "k5",
                  unit: 0,
                  balance: 0,
                  isDeduction: true,
                },
                {
                  name: "k6",
                  unit: 0,
                  balance: 0,
                  isDeduction: true,
                },
              ];
              const allUnitsNotZero = oldData.every((item) => item.unit === 0);

              //  รวมยอกทั้งหมด
              let msgString = "";
              if (!allUnitsNotZero) {
                const user = await BotEvent.getProfileInGroupById(
                  groupId,
                  userId
                );
                msgString += `👤 คุณ ${user.data.displayName}\n`;
                resultObjects.map((item) => {
                  total += item.unit;
                  // msgString += `✅ ขา ${item.name.charAt(1)} = ${
                  //   item.unit
                  // } บ.\n`;
                });
                //เช็คยอด
                const val = await usersService.getCreaditByuserId(userId);
                let isCheck = false;
                if (val.credit > total * 2) {
                  total = total * 2;
                  resultObjects.map((item1) => {
                    data.forEach((item2) => {
                      if (
                        item1.name === item2.name &&
                        item2.isDeduction === true
                      ) {
                        item2.unit += item1.unit;
                      }
                    });
                  });
                } else if (val.credit >= total) {
                  total = total;
                  resultObjects.map((item1) => {
                    data.forEach((item2) => {
                      if (
                        item1.name === item2.name &&
                        item2.isDeduction === false
                      ) {
                        item2.unit += item1.unit;
                      }
                    });
                  });
                } else {
                  isCheck = true;
                  BotEvent.replyMessage(replyToken, {
                    type: "text",
                    text: "ยอดเงินไม่พอ",
                  });
                  return;
                }

                // return;
                //เหลือ Update Credit

                //save RoundDetail

                tempOldData.forEach((item) => {
                  data.forEach((item2) => {
                    if (item.name === item2.name) {
                      if (item.unit !== 0 && item2.unit !== 0) {
                        item.unit = item2.unit;
                        item.isAdd = true;
                      } else {
                        item.unit = item2.unit;
                      }
                    }
                  });
                });
                const filterTempOldData = tempOldData.filter(
                  (item) => item.unit !== 0
                );
                console.log(filterTempOldData);
                // return;
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
                        isCancel: false,
                        isDeduction: item.isDeduction,
                      };
                      roundDetailData.push(obj);
                    });
                    console.log(roundDetailData);
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
                      roundDetailData.forEach((item) => {
                        msgString += `\n✅ ขา ${item.ka.charAt(1)} = ${
                          item.unit
                        } บ. `;
                      });
                      const checkisDeduction = roundDetailData.every(
                        (item) => item.isDeduction === false
                      );
                      msgString += `\n${
                        checkisDeduction ? "หัก" : "หักล่วงหน้า"
                      }  ${total} บ.\n`;
                      msgString += `คงเหลือ ${val.credit - total} บ.`;
                      // msgString += `✅ ขา ${item.name.charAt(1)} = ${
                      //   item.unit
                      // } บ.\n`;
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
        } else if (message === "y") {
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
              number: number,
              convertNumber:
                number.charAt(0) === "s"
                  ? convertPokNumber(number.slice(1))
                  : convertPokNumber(number),
              textNumber:
                number.charAt(0) === "s"
                  ? convertPokTxt(number.slice(1))
                  : convertPokTxt(number),
            }));
            console.log(transformedSequence);
            // return;

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
            const transformedData = transformedSequence.map((item) => ({
              textNumber: item.textNumber,
              nameTxt: item.nameTxt,
              name: item.name,
              number: item.number,
              convertNumber: item.convertNumber,
              isLeader: item.name === "k0",
              color: "",
              status: "",
              isPok: checkPok(item),
            }));

            let isWinnerExists = false;
            //เช็คผลของแต่ละขา
            for (const item of transformedData) {
              if (!item.isLeader) {
                if (
                  item.number.charAt(1) > transformedData[0].number.charAt(2)
                ) {
                  item.status = "winner";
                } else if (
                  item.number.charAt(1) === transformedData[0].number.charAt(2)
                ) {
                  item.status = "draw";
                } else {
                  item.status = "loser";
                }
              } else {
                continue;
              }
            }
            console.log(transformedData);

            await BotEvent.showResult(replyToken, [
              transformedSequence,
              mssageTotal,
            ]);
          } else {
            BotEvent.replyMessage(replyToken, {
              type: "text",
              text: "กรุณาปิดรอบก่อนสรุปผล",
            });
          }
        } else if (message === "show") {
          const round = await roundService.getRoundIdinProgress(groupId);
          const detail = await roundService.getAllRoundDetailByRoundId(
            round.id
          );
          const json = JSON.stringify(detail);
          const detailItem = JSON.parse(json);
          console.log(detailItem);
          const result = await convertArray(detailItem, groupId, userId);

          const filteredData = result.map((item) => ({
            ...item,
            play: item.play.filter((playItem) => playItem.unit !== 0),
          }));

          // Function to categorize items based on isDeduction property
          const categorizeItems = (play) => {
            const categorizedItems = play.reduce(
              (result, playItem) => {
                if (playItem.isDeduction) {
                  result.deduction.push(
                    `${playItem.name} - ${playItem.unit} Bath`
                  );
                } else {
                  result.noDeduction.push(
                    `${playItem.name} - ${playItem.unit} Bath`
                  );
                }
                return result;
              },
              { deduction: [], noDeduction: [] }
            );

            return categorizedItems;
          };

          // Create the output object for each user
          const output = filteredData.map((user) => ({
            id: user.id,
            uuid: user.uuid,
            msg: [
              "- หักล่วงหน้า",
              ...categorizeItems(user.play).deduction,
              "- ไม่หักล่วงหน้า",
              ...categorizeItems(user.play).noDeduction,
            ],
          }));
          const data = [];
          for (const item of output) {
            console.log(item);
            const userLine =
              (await BotEvent.getProfileInGroupById(groupId, item.uuid)) ??
              null;
            data.push({
              name: `👤 คุณ ${
                userLine?.data?.displayName === undefined
                  ? "ไม่่พบชื่อ"
                  : userLine?.data?.displayName
              }`,
              msg: `${item.msg.join("\n")}`,
            });
            const msgStringRes = [];
            for (const item of data) {
              const json = {
                type: "box",
                layout: "horizontal",
                offsetTop: "30px",
                contents: [
                  {
                    type: "text",
                    text: item.name,
                    align: "start",
                    wrap: true,
                    size: "sm",
                    gravity: "center",
                    contents: [],
                  },
                  {
                    type: "text",
                    text: item.msg,
                    wrap: true,
                    size: "sm",
                    align: "start",
                    gravity: "center",
                    contents: [],
                  },
                ],
              };

              msgStringRes.push(json);
            }
            // console.log(msgStringRes);
            // const msgObj = {
            //   round: 1,
            //   count: msgStringRes.length,
            //   msg: msgStringRes,
            // };
            console.log(
              JSON.stringify(flex.showResult2(msgStringRes), null, 2)
            );
            await BotEvent.replyMessage(
              replyToken,
              flex.showResult2(msgStringRes)
            );
          }
          console.log(data);
        } else if (message === "cf") {
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
const checkPok = (data) => {
  console.log(data.name);
  if (data.name === "k0") {
    console.log(data.number.charAt(1));
    if (data.number.charAt(1) === "2") {
      return true;
    } else {
      return false;
    }
  } else {
    console.log(data.number.charAt(0));
    if (data.number.charAt(0) === "2") {
      return true;
    } else {
      return false;
    }
  }
};
const calculate = async (res, detail, groupId, replyToken) => {
  const transformedData = res.map((item) => ({
    name: item.name,
    number: item.number,
    convertNumber: item.convertNumber,
    isLeader: item.name === "k0",
    status: "",
    isPok: checkPok(item),
  }));

  console.log(transformedData);

  let isWinnerExists = false;
  //เช็คผลของแต่ละขา
  for (const item of transformedData) {
    if (!item.isLeader) {
      if (item.number.charAt(1) > transformedData[0].number.charAt(2)) {
        item.status = "winner";
      } else if (
        item.number.charAt(1) === transformedData[0].number.charAt(2)
      ) {
        item.status = "draw";
      } else {
        item.status = "loser";
      }
    } else {
      continue;
    }
  }

  // console.log(transformedData);

  results = await convertArray(detail, groupId, replyToken);
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
            console.log(`jao ${transformedData[0].isPok}`);
            if (transformedData[0].isPok === true) {
              if (play.isDeduction) {
                play.broken += play.unit * 2;
                play.balance = 0;
                item.total += play.balance;
                item.totalBroken += play.broken;
              } else {
                play.broken += play.unit * 1;
                play.balance = 0;
                item.total += play.balance;
                item.totalBroken += play.broken;
              }
            } else {
              if (play.isDeduction) {
                play.broken += play.unit * 1;
                play.balance = play.unit * 1;
                item.total += play.balance;
                item.totalBroken += play.broken;
              } else {
                play.balance = 0;
                play.broken += 0;
                item.total += play.balance;
                item.totalBroken += play.broken;
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

  let msgStringRes = [];
  // async function formatAsText(obj) {
  //   const userLine = await BotEvent.getProfileInGroupById(groupId, obj.uuid);
  //   return ();
  // }
  const dataMsg = {
    name: "",
    balance: "",
    total: "",
  };
  for (const item of results) {
    const userLine = await BotEvent.getProfileInGroupById(groupId, item.uuid);
    const credit = await usersService.getCreadit(item.id);

    const json = {
      type: "box",
      layout: "horizontal",
      offsetTop: "30px",
      contents: [
        {
          type: "text",
          text: userLine.data.displayName,
          align: "start",
          gravity: "center",
          contents: [],
        },
        {
          type: "text",
          text: `${
            item.total - item.totalBroken > 0
              ? `+${item.total}`
              : `-${item.totalBroken}`
          } = ${credit.credit + item.total}`,
          align: "center",
          gravity: "center",
          contents: [],
        },
      ],
    };
    console.log(json);
    msgStringRes.push(json);
    // dataMsg.name = userLine.data.displayName;
    // dataMsg.balance =
    //   item.total - item.totalBroken > 0
    //     ? `+${item.toatl}`
    //     : `-${item.totalBroken}`;
    // dataMsg.total = credit.credit + item.total;
    // msgStringRes += `ชื่อ = ${userLine.data.displayName} ยอดรวม = ${
    //   item.total > item.unit ? `${item.total}` : `${item.unit}` + "\n"
    // }`;
  }
  console.log(msgStringRes);
  // console.log(msgStringRes);
  return msgStringRes;
  console.log(replyToken);
  // await BotEvent.replyMessage(replyToken, {
  //   type: "text",
  //   text: msgStringRes,
  // });
};
const convertPokNumber = (data) => {
  //pok 9*2  = 999
  //pok 9*1 = 998
  //pok 8*2 = 997
  //pok 8*1 = 996
  //pok 7.5*2 = 995
  //pok 7.5*1 = 994
  //pok 7*1 = 993
  //pok 6*1 = 992
  //pok 5*1 = 991
  //pok 4*1 = 990
  //pok 3*1 = 989
  //pok 2*2 = 987
  //pok 2*1 = 986
  //pok 1*1 = 985
  //pok 0*1 = 984
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

async function convertArray(inputArray, groupId, userId) {
  const outputArray = [];
  for (const item of inputArray) {
    // const test = await BotEvent.getProfileInGroupById(groupId, item.userId);

    const existingObject = outputArray.find((obj) => obj.id === item.userId);

    if (existingObject) {
      const playIndex = existingObject.play.findIndex(
        (playItem) =>
          playItem.name === item.ka && playItem.isDeduction === item.isDeduction
      );

      if (playIndex !== -1) {
        existingObject.play[playIndex].unit += item.unit;
        // existingObject.play[playIndex].isDeduction = item.isDeduction;
      }
    } else {
      const newObject = {
        id: item.userId,
        nameLine: "",
        uuid: item.User.uuid_line,
        play: [
          { name: "k1", unit: 0, balance: 0, broken: 0, isDeduction: false },
          { name: "k2", unit: 0, balance: 0, broken: 0, isDeduction: false },
          { name: "k3", unit: 0, balance: 0, broken: 0, isDeduction: false },
          { name: "k4", unit: 0, balance: 0, broken: 0, isDeduction: false },
          { name: "k5", unit: 0, balance: 0, broken: 0, isDeduction: false },
          { name: "k6", unit: 0, balance: 0, broken: 0, isDeduction: false },
          { name: "k1", unit: 0, balance: 0, broken: 0, isDeduction: true },
          { name: "k2", unit: 0, balance: 0, broken: 0, isDeduction: true },
          { name: "k3", unit: 0, balance: 0, broken: 0, isDeduction: true },
          { name: "k4", unit: 0, balance: 0, broken: 0, isDeduction: true },
          { name: "k5", unit: 0, balance: 0, broken: 0, isDeduction: true },
          { name: "k6", unit: 0, balance: 0, broken: 0, isDeduction: true },
        ],
        unit: 0,
        total: 0,
        totalBroken: 0,
      };

      const playIndex = newObject.play.findIndex(
        (playItem) =>
          playItem.name === item.ka && playItem.isDeduction === item.isDeduction
      );
      if (playIndex !== -1) {
        newObject.play[playIndex].unit += item.unit;
        // newObject.play[playIndex].isDeduction = item.isDeduction;
      }

      outputArray.push(newObject);
    }
  }

  outputArray.forEach((obj) => {
    obj.unit = obj.play.reduce((sum, playItem) => sum + playItem.unit, 0);
  });
  console.log(JSON.stringify(outputArray, null, 2));
  return outputArray;
}

module.exports = {
  hookMessageLine,
};
