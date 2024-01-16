//import helper
const BotEvent = require("../helper/BotEvent");
const usersService = require("../services/users.service");
const roundService = require("../services/round.service");
const transactionService = require("../services/transaction.service");
const flex = require("../constants/flexMesaage");

// ctrl + f go to KeyWord Function
// KeyWord Check Credit
// KeyWord Cancel
// KeyWord OpenRound
// KeyWord CloseRound
let results = [];
let mssageTotal = "";

const hookMessageLine = async (req, res) => {
  try {
    if (req.body.events.length !== 0) {
      if (req.body.events[0].message.type === "text") {
        console.log(JSON.stringify(req.body.events[0], null, 2));

        const message = req.body.events[0].message.text;
        const replyToken = req.body.events[0].replyToken;
        const userId = req.body.events[0].source.userId;
        const groupId = req.body.events[0].source.groupId;

        //check ว่าเปิดรอบไหม
        //update เงิน
        //บันทึกข้อมูล
        try {
          // KeyWord Check Credit
          if (
            message === "เช็คยอด" ||
            message === "check" ||
            message === "c" ||
            message === "C" ||
            message === "Check"
          ) {
            checkCredit(replyToken, userId, groupId);
            // KeyWord Cancel
          } else if (message === "x" || message === "X") {
            // const round = await roundService.getCountRoundInProgress(groupId);
            cancel(replyToken, userId, groupId);
          } else {
            playPok(replyToken, userId, groupId, message);
          }
        } catch (error) {
          console.log(error);
          return;
        }
        if (
          userId === "Uab6dc3240000f41c68d86744421b375d" ||
          userId === "U33113ebe5b40a3a017da7dbe921c2b0c" ||
          userId === "U881888a45c276e2c66039d422326068d" ||
          userId === "Ub6834bd1c305b10498e15c335ca567ee" ||
          userId === "Ue43f8f53001fecf7a0fbf027ac43b215" ||
          userId === "Ubca0cc846191b893283be4082cefcf76" ||
          userId === "Uab6dc3240000f41c68d86744421b375d" ||
          userId === "Ub6834bd1c305b10498e15c335ca567ee" ||
          userId === "U6f607e943211560f9f435f240272e4ae" ||
          userId === "U626d55bed62ca50956f8094b17994f49" ||
          userId === "U45b8041a690866573e469b8d3863377e"
        ) {
          // OpenRound

          if (message === "o" || message === "O") {
            await openRound(replyToken, userId, groupId);
          } else if (message === "CC" || message === "cc") {
            await cancelRound(replyToken, userId, groupId);
          } else if (message === "y" || message === "Y") {
            await closeRound(replyToken, userId, groupId);
          } else if (
            (message.charAt(0) === "s" || message.charAt(0) === "S") &&
            message.split(",").length === 7
          ) {
            await sentResult(replyToken, userId, groupId, message);
          } else if (message === "cf" || message === "Cf" || message === "CF") {
            await confirmRound(replyToken, userId, groupId);
          } else if (message === "show") {
            const getRound = await roundService.getRound(groupId);
            console.log(getRound.round);
            // const json = JSON.stringify(getRound);
            // const roundItem = JSON.parse(json);
            // console.log(roundItem[0].round);
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
    return;
  }
  res.sendStatus(200);
};
const showAll = async (data, gId, round) => {
  let msgString = "";
  msgString += `✅ สรุปรายการแทงรอบที่ ${round} \n`;
  if (data.length !== 0) {
    for await (const entry of data) {
      const userLine = await BotEvent.getProfileInGroupById(gId, entry.uuid);
      const name =
        (await userLine?.data) === undefined
          ? "ไม่พบผู้ใช้"
          : `${userLine?.data?.displayName}`;
      msgString += `\n👤 คุณ${name}`;
      entry.play.forEach((play) => {
        msgString += `ขา ${play.name.charAt(1)}=${play.unit}บ. `;
      });
    }
  } else {
    msgString += "ไม่มีผู้เล่นในรอบนี้";
  }
  return msgString;
};
const checkPok = (data) => {
  if (data.name === "k0") {
    if (data.number.charAt(1) === "2") {
      return true;
    } else {
      return false;
    }
  } else {
    if (data.number.charAt(0) === "2") {
      return true;
    } else {
      return false;
    }
  }
};
const calculate = async (res, detail, groupId, replyToken, roundss) => {
  console.log(roundss);
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
      if (
        parseFloat(item.number.slice(1)) >
        parseFloat(transformedData[0].number.split("s")[1].slice(1))
      ) {
        item.status = "winner";
      } else if (
        parseFloat(item.number.slice(1)) ===
        parseFloat(transformedData[0].number.split("s")[1].slice(1))
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

  results = await convertArray(detail, groupId, replyToken);
  console.log(results);
  // transformedData.forEach((e) => {
  //   results.forEach((item) => {
  //     item.play.forEach((play) => {
  //       if (e.name === play.name) {
  //         if (e.status === "winner") {
  //           if (e.isPok === true) {
  //             if (play.isDeduction) {
  //               play.balance = play.unit * 2 * 2;
  //               item.total += play.balance;
  //               play.net += play.unit * 2;
  //             } else {
  //               play.balance = play.unit * 2;
  //               item.total += play.balance;
  //               play.net += play.unit;
  //             }
  //           } else {
  //             if (play.isDeduction) {
  //               play.balance = play.unit + play.unit * 2;
  //               item.total += play.balance;
  //               play.net += play.unit;
  //             } else {
  //               play.balance = play.unit * 2;
  //               item.total += play.balance;
  //               play.net += play.unit;
  //             }
  //           }
  //         } else if (e.status === "loser") {
  //           if (transformedData[0].isPok === true) {
  //             if (play.isDeduction) {
  //               play.broken += play.unit * 2;
  //               play.balance = 0;
  //               item.total += play.balance;
  //               item.totalBroken += play.broken;
  //             } else {
  //               play.broken += play.unit * 1;
  //               play.balance = 0;
  //               item.total += play.balance;
  //               item.totalBroken += play.broken;
  //             }
  //           } else {
  //             if (play.isDeduction) {
  //               play.broken += play.unit * 1;
  //               play.balance = play.unit * 1;
  //               item.total += play.balance;
  //               item.totalBroken += play.broken;
  //             } else {
  //               play.balance = 0;
  //               play.broken += 0;
  //               item.total += play.balance;
  //               item.totalBroken += play.broken;
  //             }
  //           }
  //         } else {
  //           if (play.isDeduction) {
  //             play.balance = play.unit * 2;
  //             item.total += play.balance;
  //           } else {
  //             play.balance = play.unit * 1;
  //             item.total += play.balance;
  //           }
  //         }
  //       }
  //     });
  //   });
  // });
  // console.log(JSON.stringify(results, null, 2));

  let msgStringRes = [];

  // }
  const dataMsg = {
    name: "",
    balance: "",
    total: "",
  };
  let msgString = "";
  msgString += `✅ สรุปยอดรอบที่ ${roundss}\n`;

  results.forEach((obj) => {
    obj.totalBalance = obj.play.reduce(
      (sum, playItem) => sum + playItem.balance,
      0
    );
  });
  results.forEach((obj) => {
    obj.totalNet = obj.play.reduce((sum, playItem) => sum + playItem.net, 0);
  });
  if (results.length !== 0) {
    for (const item of results) {
      const userLine = await BotEvent.getProfileInGroupById(groupId, item.uuid);
      const credit = await usersService.getCreadit(item.id);
      msgString += `คุณ${
        userLine?.data === undefined ? "ไม่พบผู้ใช้" : userLine.data.displayName
      }   `;
      msgString += `${
        item.totalNet - item.totalBroken < 0
          ? `${item.totalNet - item.totalBroken}`
          : `+${item.totalNet - item.totalBroken}`
      } = ${credit.credit + item.total}\n`;
      msgString += "------------\n";
    }
  } else {
    msgString = "ไม่มีผู้เล่นในรอบนี้";
  }
  console.log(msgString);

  return msgString;

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
  } else if (data === "27") {
    pok = 993;
  } else if (data === "17") {
    pok = 992;
  } else if (data === "26") {
    pok = 991;
  } else if (data === "16") {
    pok = 990;
  } else if (data === "25") {
    pok = 989;
  } else if (data === "15") {
    pok = 988;
  } else if (data === "24") {
    pok = 987;
  } else if (data === "14") {
    pok = 986;
  } else if (data === "23") {
    pok = 985;
  } else if (data === "13") {
    pok = 984;
  } else if (data === "22") {
    pok = 983;
  } else if (data === "12") {
    pok = 982;
  } else if (data === "21") {
    pok = 981;
  } else if (data === "11") {
    pok = 980;
  } else {
    pok = 979;
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
  } else if (data === "27") {
    pok = "7แต้มเด้ง";
  } else if (data === "17") {
    pok = "7แต้ม";
  } else if (data === "26") {
    pok = "6แต้มเด้ง";
  } else if (data === "16") {
    pok = "6แต้ม";
  } else if (data === "25") {
    pok = "5แต้มเด้ง";
  } else if (data === "15") {
    pok = "5แต้ม";
  } else if (data === "24") {
    pok = "4แต้มเด้ง";
  } else if (data === "14") {
    pok = "4แต้ม";
  } else if (data === "23") {
    pok = "3แต้มเด้ง";
  } else if (data === "13") {
    pok = "3แต้ม";
  } else if (data === "22") {
    pok = "2แต้มเด้ง";
  } else if (data === "12") {
    pok = "2แต้ม";
  } else if (data === "21") {
    pok = "1แต้มเด้ง";
  } else if (data === "11") {
    pok = "1แต้ม";
  } else {
    pok = "บอด";
  }

  return pok;
};

// async function convertArray(inputArray, groupId, userId) {
//   const outputArray = [];
//   for (const item of inputArray) {
//     // const test = await BotEvent.getProfileInGroupById(groupId, item.userId);

//     const existingObject = outputArray.find((obj) => obj.id === item.userId);

//     if (existingObject) {
//       const playIndex = existingObject.play.findIndex(
//         (playItem) =>
//           playItem.name === item.ka && playItem.isDeduction === item.isDeduction
//       );

//       if (playIndex !== -1) {
//         existingObject.play[playIndex].unit += item.unit;
//         // existingObject.play[playIndex].isDeduction = item.isDeduction;
//       }
//       const unitTotalMultiplier = item.isDeduction ? 2 : 1;

//       // Update unitTotal for each play item
//       existingObject.play.forEach((playItem) => {
//         playItem.unitTotal = playItem.unit * unitTotalMultiplier;
//       });
//     } else {
//       const newObject = {
//         id: item.userId,
//         nameLine: "",
//         uuid: item.User.uuid_line,
//         play: [
//           {
//             name: "k1",
//             unit: 0,
//             balance: 0,
//             broken: 0,
//             unitTotal: 0,
//             net: 0,
//             isDeduction: false,
//           },
//           {
//             name: "k2",
//             unit: 0,
//             balance: 0,
//             broken: 0,
//             unitTotal: 0,
//             net: 0,
//             isDeduction: false,
//           },
//           {
//             name: "k3",
//             unit: 0,
//             balance: 0,
//             broken: 0,
//             unitTotal: 0,
//             net: 0,
//             isDeduction: false,
//           },
//           {
//             name: "k4",
//             unit: 0,
//             balance: 0,
//             broken: 0,
//             unitTotal: 0,
//             net: 0,
//             isDeduction: false,
//           },
//           {
//             name: "k5",
//             unit: 0,
//             balance: 0,
//             broken: 0,
//             unitTotal: 0,
//             net: 0,
//             isDeduction: false,
//           },
//           {
//             name: "k6",
//             unit: 0,
//             balance: 0,
//             broken: 0,
//             unitTotal: 0,
//             net: 0,
//             isDeduction: false,
//           },
//           {
//             name: "k1",
//             unit: 0,
//             balance: 0,
//             broken: 0,
//             unitTotal: 0,
//             net: 0,
//             isDeduction: true,
//           },
//           {
//             name: "k2",
//             unit: 0,
//             balance: 0,
//             broken: 0,
//             unitTotal: 0,
//             net: 0,
//             isDeduction: true,
//           },
//           {
//             name: "k3",
//             unit: 0,
//             balance: 0,
//             broken: 0,
//             unitTotal: 0,
//             net: 0,
//             isDeduction: true,
//           },
//           {
//             name: "k4",
//             unit: 0,
//             balance: 0,
//             broken: 0,
//             unitTotal: 0,
//             net: 0,
//             isDeduction: true,
//           },
//           {
//             name: "k5",
//             unit: 0,
//             balance: 0,
//             broken: 0,
//             unitTotal: 0,
//             net: 0,
//             isDeduction: true,
//           },
//           {
//             name: "k6",
//             unit: 0,
//             balance: 0,
//             broken: 0,
//             unitTotal: 0,
//             net: 0,
//             isDeduction: true,
//           },
//         ],
//         totalNet: 0,
//         unitTotal: 0,
//         unit: 0,
//         total: 0,
//         totalBroken: 0,
//         totalBalance: 0,
//       };

//       const playIndex = newObject.play.findIndex(
//         (playItem) =>
//           playItem.name === item.ka && playItem.isDeduction === item.isDeduction
//       );
//       if (playIndex !== -1) {
//         newObject.play[playIndex].unit += item.unit;
//         // newObject.play[playIndex].isDeduction = item.isDeduction;
//       }

//       outputArray.push(newObject);
//     }
//   }

//   outputArray.forEach((obj) => {
//     obj.unitTotal = obj.play.reduce(
//       (sum, playItem) => sum + playItem.unitTotal,
//       0
//     );
//   });
//   outputArray.forEach((obj) => {
//     obj.unit = obj.play.reduce((sum, playItem) => sum + playItem.unit, 0);
//   });

//   console.log(JSON.stringify(outputArray, null, 2));
//   return outputArray;
// }

const checkCredit = async (replyToken, userId, groupId) => {
  const val = await usersService.getCreaditByuserId(userId);
  const credit = val.credit;

  const user = await BotEvent.getProfileInGroupById(groupId, userId);
  const data = {
    name: user.data.displayName,
    replyToken: replyToken,
    credit: credit.toLocaleString(),
  };

  await BotEvent.getCreadit(data);
};

const openRound = async (replyToken, userId, groupId) => {
  const isRound = await roundService.checkRoundInprogress(groupId);
  if (isRound) {
    const data = {
      message: "มีรอบที่กำลังเปิดอยู่",
      replyToken: replyToken,
    };
    await BotEvent.replyMessage(replyToken, {
      type: "text",
      text: "มีรอบที่กำลังเปิดอยู่",
    });
    return;
  } else {
    const date = new Date();
    const formattedDate = date.toISOString().split("T")[0].toString();
    const getRound = await roundService.getRound(groupId);
    const data = {
      message:
        getRound.length === 0
          ? `รอบที่ 1`
          : `รอบที่ ${parseInt(getRound[0].round) + 1}`,
      replyToken: replyToken,
      groupId: groupId,
      userId: userId,
    };
    const round = {
      round: getRound.length === 0 ? 1 : parseInt(getRound[0].round) + 1,
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
  // KeyWord CloseRound
};

const closeRound = async (replyToken, userId, groupId) => {
  const isRound = await roundService.getRoundIdinProgress(groupId);

  if (isRound === null) {
    const data = {
      message: "ไม่มีรอบที่กำลังเปิดอยู่",
      replyToken: replyToken,
    };
    await BotEvent.replyMessage(
      replyToken,
      BotEvent.replyMessage(replyToken, {
        type: "image",
        originalContentUrl: "https://hook.nuenghub-soft.online/img/w13.png",
        previewImageUrl: "https://hook.nuenghub-soft.online/img/w13.png",
      })
    );
    return;
  } else {
    const date = new Date();
    const formattedDate = date.toISOString().split("T")[0].toString();
    const round = await roundService.getRoundIdinProgress(groupId);
    const json = JSON.stringify(round);
    const roundItem = JSON.parse(json);
    const updateRound = await roundService.closeRound(roundItem.id, groupId);
    if (updateRound) {
      const detail = await roundService.getAllRoundDetailByRoundId(round.id);
      const json = JSON.stringify(detail);
      const detailItem = JSON.parse(json);
      const result = await convertArray(detailItem, groupId, userId);

      const outputData = result.map((entry) => {
        const playData = entry.play.reduce((acc, playEntry) => {
          if (playEntry.unit !== 0) {
            const existingPlayEntry = acc.find(
              (p) => p.name === playEntry.name
            );

            if (existingPlayEntry) {
              existingPlayEntry.unit += playEntry.unit;
            } else {
              acc.push({
                name: playEntry.name,
                unit: playEntry.unit,
              });
            }
          }

          return acc;
        }, []);

        return {
          id: entry.id,
          uuid: entry.uuid,
          play: playData,
        };
      });
      const dataMsg = await showAll(outputData, groupId, isRound.round);

      await BotEvent.replyMessage(replyToken, [
        // flex.startRound("ปิดรอบเรียบร้อย"),
        {
          type: "image",
          originalContentUrl: "https://hook.nuenghub-soft.online/img/w11.png",
          previewImageUrl: "https://hook.nuenghub-soft.online/img/w11.png",
        },
        {
          type: "text",
          text: dataMsg,
        },
      ]);
    }
    return;
  }
};

const cancelRound = async (replyToken, userId, groupId) => {
  const isRound = await roundService.getRoundIdinProgress(groupId);
  const getRound = await roundService.getRound(groupId);

  if (isRound === null) {
    const data = {
      message: "ไม่มีรอบที่กำลังเปิดอยู่",
      replyToken: replyToken,
    };
    await BotEvent.replyMessage(
      replyToken,
      BotEvent.replyMessage(replyToken, {
        type: "image",
        originalContentUrl: "https://hook.nuenghub-soft.online/img/w13.png",
        previewImageUrl: "https://hook.nuenghub-soft.online/img/w13.png",
      })
    );
    return;
  } else {
    const detail = await roundService.getAllRoundDetailByRoundId(isRound.id);
    const json = JSON.stringify(detail);
    const detailItem = JSON.parse(json);
    // const results = await convertArray(
    //   detailItem,
    //   groupId,
    //   replyToken
    // );
    let deleteId = [];
    for (const item of detailItem) {
      deleteId.push(item.id);
      const user = await usersService.getCreadit(item.userId);
      console.log(user);
      const newCredit = item.isDeduction
        ? user.credit + item.unit * 2
        : user.credit + item.unit;
      await usersService.updateCreditById(newCredit, item.userId);
    }
    const update = await roundService.updateRoundDetail(deleteId);
    const cancelRound = await roundService.cancelRound(isRound.id);
    if (update && cancelRound) {
      await BotEvent.replyMessage(replyToken, {
        type: "text",
        text: `ยกเลิกรอบที่ ${isRound.round} เรียบร้อย ❌`,
      });
    }
  }
};

const sentResult = async (replyToken, userId, groupId, message) => {
  const round = await roundService.getCloseRoundAndinProgress(groupId);
  // const isRound = await roundService.getCountRoundInProAndclose(groupId);
  if (round !== null) {
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
    console.log(round.id);
    const detail = await roundService.getAllRoundDetailByRoundId(round.id);
    const json = JSON.stringify(detail);
    const detailItem = JSON.parse(json);
    console.log(detailItem);
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

    for (const item of transformedData) {
      if (!item.isLeader) {
        if (
          parseFloat(item.number.slice(1)) >
          parseFloat(transformedData[0].number.split("s")[1].slice(1))
        ) {
          item.status = "winner";
        } else if (
          parseFloat(item.number.slice(1)) ===
          parseFloat(transformedData[0].number.split("s")[1].slice(1))
        ) {
          item.status = "draw";
        } else {
          item.status = "loser";
        }
      } else {
        continue;
      }
    }
    const dataTotal = [];
    transformedData.forEach((e) => {
      dataTotal.push({
        number: e.name === "k0" ? e.number.split("s")[1] : e.number,
      });
    });
    const saveResult = await roundService.updateKa(round.id, dataTotal);
    if (saveResult) {
      const dataSort = await sortResult(
        detailItem,
        transformedData,
        replyToken,
        round.round,
        groupId
      );
      await BotEvent.showResult(replyToken, dataSort, round.round);
    }

    return;
    mssageTotal = await calculate(
      transformedSequence,
      detailItem,
      groupId,
      replyToken,
      round.round
    );

    //  transformedData.map((item) => ({
    //   dataTotal.push()
    //   }));
    transformedData.forEach((e) => {
      dataTotal.push({
        number: e.name === "k0" ? e.number.split("s")[1] : e.number,
      });
    });
    console.log(dataTotal);
    const query = roundService.updateKa(round.id, dataTotal);
    if (query) {
      let isWinnerExists = false;
      //เช็คผลของแต่ละขา

      console.log(transformedData);
    }
  } else {
    BotEvent.replyMessage(replyToken, {
      type: "text",
      text: "กรุณาปิดรอบก่อนสรุปผล",
    });
  }
};
const sortResult = async (res, results, replyToken, roundNo, groupId) => {
  const groupedData = res.reduce((result, item) => {
    const key = `${item.userId}`;
    if (!result[key]) {
      result[key] = {
        userId: item.userId,
        User: item.User,

        data: [],
      };
    }

    const dataItem = {
      isDeduction: item.isDeduction,
      isCancel: item.isCancel,
      ka: item.ka,
      fight: item.fight,
      unit: item.unit,
    };

    result[key].data.push(dataItem);

    return result;
  }, {});

  const finalResult = Object.values(groupedData).map((userItem) => {
    const groupedData = userItem.data.reduce((result, item) => {
      const key = `${item.isDeduction}_${item.ka}_${item.fight}`;
      console.log(key);
      if (!result[key]) {
        result[key] = {
          isDeduction: item.isDeduction,
          ka: item.ka,
          fight: item.fight,
          isKaFightLeader: item.fight === "k0" ? true : false,
          isKaFightKa: item.fight !== "k0" && item.ka !== "k0" ? true : false,
          isLeaderFightKa: item.ka === "k0" ? true : false,
          status: "",
          income: 0,
          unit: 0,
          balance: 0,
          totalBroken: 0,
          net: 0,
        };
      }
      result[key].unit += item.unit;
      return result;
    }, {});

    const groupedArray = Object.values(groupedData);

    return {
      userId: userItem.userId,
      User: userItem.User,
      data: groupedArray,
      totalUnit: 0,
      totalBroken: 0,
      totalNet: 0,
      total: 0,
      totalIncome: 0,
    };
  });

  for (const userItem of finalResult) {
    for (const kaItem of userItem.data) {
      const result = await calculateResult(kaItem, results);
      kaItem.income = result.income;
      kaItem.balance = result.total;
      kaItem.totalBroken = result.broken;
      kaItem.net = result.net;
      kaItem.status = result.status;
    }
  }
  finalResult.forEach((obj) => {
    obj.totalUnit = obj.data.reduce((sum, playItem) => sum + playItem.unit, 0);
    obj.totalBroken = obj.data.reduce(
      (sum, playItem) => sum + playItem.totalBroken,
      0
    );
    obj.totalNet = obj.data.reduce((sum, playItem) => sum + playItem.net, 0);
    obj.total = obj.data.reduce((sum, playItem) => sum + playItem.balance, 0);
    obj.totalIncome = obj.data.reduce(
      (sum, playItem) => sum + playItem.income,
      0
    );
  });
  const data1 = [];
  for (let i of finalResult) {
    const userLine = await BotEvent.getProfileInGroupById(
      groupId,
      i.User.uuid_line
    );
    const credit = await usersService.getCreadit(i.userId);
    const data = {
      name:
        userLine?.data === undefined
          ? "ไม่พบผู้ใช้"
          : userLine.data.displayName,
      unit: `${
        i.totalIncome - i.totalBroken < 0
          ? `${i.totalIncome - i.totalBroken}`
          : `+${i.totalIncome - i.totalBroken}`
      } = ${credit.credit + i.total}\n`,
    };
    data1.push(data);
  }
  console.log(JSON.stringify(finalResult, null, 2));

  // for (let i = 0; i < 30; i++) {
  //   data1.push({
  //     name: `k${i}`,
  //     unit: 31231232321,
  //   });
  // }
  const showData = chunkArray(data1, 25);
  const allData = [];
  for (let i of showData) {
    const result = [];
    for (let j of i) {
      result.push({
        type: "box",
        layout: "baseline",
        spacing: "xs",
        margin: "xs",
        contents: [
          {
            type: "text",
            size: "xxs",
            text: j.name,
            contents: [],
          },
          {
            type: "text",
            size: "xxs",
            wrap: true,
            text: j.unit.toString(),
            align: "end",
            contents: [],
          },
        ],
      });
    }
    const data = {
      type: "bubble",
      direction: "ltr",
      header: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: `สรุปการเดิมพันรอบที่ ${roundNo}`,
            align: "center",
            contents: [],
          },
        ],
      },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "none",
        margin: "none",
        contents: result,
      },
    };
    allData.push(data);
  }
  return [results, allData, finalResult];
  // await BotEvent.showResult(replyToken, [results, allData], roundNo);
};
const chunkArray = (array, size) => {
  const chunked_arr = [];
  for (let i = 0; i < array.length; i += size) {
    chunked_arr.push(array.slice(i, i + size));
  }
  return chunked_arr;
};
const calculateResult = async (data, result) => {
  const dataPlayer = {
    status: "",
    kaItem: "",
    fightItem: "",
    isDeduction: data.isDeduction,
    isKaFightLeader: data.isKaFightLeader,
    isKaFightKa: data.isKaFightKa,
    isLeaderFightKa: data.isLeaderFightKa,
    isPok: false,
    unit: data.unit,
    income: 0,
    deduction: 0,
    total: 0,
    net: 0,
    broken: 0,
  };
  const ka = result.find((item) => item.name === data.ka);
  const fg = result.find((item) => item.name === data.fight);
  dataPlayer.kaItem = ka.convertNumber;
  dataPlayer.fightItem = fg.convertNumber;

  if (dataPlayer.kaItem > dataPlayer.fightItem) {
    dataPlayer.status = "winner";
    dataPlayer.isPok = await checkPok(ka);
  } else if (dataPlayer.kaItem === dataPlayer.fightItem) {
    dataPlayer.status = "draw";
  } else {
    dataPlayer.isPok = await checkPok(fg);
    dataPlayer.status = "loser";
  }
  if (dataPlayer.isKaFightLeader) {
    if (dataPlayer.status === "winner") {
      if (dataPlayer.isPok === true) {
        if (dataPlayer.isDeduction) {
          dataPlayer.total = dataPlayer.unit * 2 * 2;
          dataPlayer.deduction = dataPlayer.unit * 2 - dataPlayer.unit;
          dataPlayer.net += dataPlayer.unit * 2;
          dataPlayer.income = dataPlayer.unit * 2 * 2;
        } else {
          dataPlayer.total = dataPlayer.unit * 2;
          dataPlayer.deduction = 0;
          dataPlayer.net += dataPlayer.unit;
          dataPlayer.income = dataPlayer.unit * 2;
        }
      } else {
        if (dataPlayer.isDeduction) {
          dataPlayer.total = dataPlayer.unit + dataPlayer.unit * 2;
          dataPlayer.deduction = dataPlayer.unit * 2 - dataPlayer.unit;
          dataPlayer.net += dataPlayer.unit;
          dataPlayer.income = dataPlayer.unit * 2;
        } else {
          dataPlayer.total = dataPlayer.unit * 2;
          dataPlayer.deduction = 0;
          dataPlayer.net += dataPlayer.unit;
          dataPlayer.income = dataPlayer.unit * 2;
        }
      }
    }
  } else {
    if (dataPlayer.status === "winner") {
      if (dataPlayer.isPok === true) {
        if (dataPlayer.isDeduction) {
          dataPlayer.total = Math.floor((dataPlayer.unit * 2 * 2 * 90) / 100);
          dataPlayer.deduction = dataPlayer.unit * 2 - dataPlayer.unit;
          dataPlayer.net += dataPlayer.unit * 2;
          dataPlayer.income = Math.floor((dataPlayer.unit * 2 * 2 * 90) / 100);
        } else {
          dataPlayer.total = Math.floor((dataPlayer.unit * 2 * 90) / 100);
          dataPlayer.deduction = 0;
          dataPlayer.net += dataPlayer.unit;
          dataPlayer.income = Math.floor((dataPlayer.unit * 2 * 90) / 100);
        }
      } else {
        if (dataPlayer.isDeduction) {
          dataPlayer.total = Math.floor(
            (dataPlayer.unit + dataPlayer.unit * 2 * 90) / 100
          );
          dataPlayer.deduction = dataPlayer.unit * 2 - dataPlayer.unit;
          dataPlayer.net += dataPlayer.unit;
          dataPlayer.income = Math.floor(
            (dataPlayer.unit + dataPlayer.unit * 2 * 90) / 100
          );
        } else {
          dataPlayer.total = Math.floor((dataPlayer.unit * 2 * 90) / 100);
          dataPlayer.deduction = 0;
          dataPlayer.net += dataPlayer.unit;
          dataPlayer.income = Math.floor((dataPlayer.unit * 2 * 90) / 100);
        }
      }
    }
  }
  if (dataPlayer.status === "loser") {
    if (dataPlayer.isPok === true) {
      if (dataPlayer.isDeduction) {
        dataPlayer.broken += dataPlayer.unit * 2;
        dataPlayer.total += 0;
      } else {
        dataPlayer.broken += dataPlayer.unit * 1;
        dataPlayer.total += 0;
        dataPlayer.totalBroken += dataPlayer.broken;
      }
    } else {
      if (dataPlayer.isDeduction) {
        dataPlayer.broken += dataPlayer.unit * 1;
        dataPlayer.total += dataPlayer.unit * 1;
      } else {
        dataPlayer.broken += 0;
        dataPlayer.total += 0;
      }
    }
  } else {
    if (dataPlayer.isDeduction) {
      dataPlayer.total += dataPlayer.unit * 2;
    } else {
      dataPlayer.total += dataPlayer.unit * 1;
    }
  }
  return dataPlayer;
};
const confirmRound = async (replyToken, userId, groupId) => {
  const round = await roundService.getCloseRoundAndinProgress(groupId);
  // round.k0
  const result = [
    `s${round.k0}`,
    round.k1,
    round.k2,
    round.k3,
    round.k4,
    round.k5,
    round.k6,
  ];
  console.log(result);
  const transformedSequence = [];
  for (let n in result) {
    const data = {
      name: `k${n}`,
      number: result[n],
      convertNumber: convertPokNumber(result[n]),
    };
    transformedSequence.push(data);
  }
  // console.log(transformedSequence);
  const transformedData = transformedSequence.map((item) => ({
    name: item.name,
    number: item.number,
    convertNumber: item.convertNumber,
    isLeader: item.name === "k0",
    color: "",
    status: "",
    isPok: checkPok(item),
  }));

  for (const item of transformedData) {
    if (!item.isLeader) {
      if (
        parseFloat(item.number.slice(1)) >
        parseFloat(transformedData[0].number.split("s")[1].slice(1))
      ) {
        item.status = "winner";
      } else if (
        parseFloat(item.number.slice(1)) ===
        parseFloat(transformedData[0].number.split("s")[1].slice(1))
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
  // const transformedSequence = result.map((number, index) => ({

  const detail = await roundService.getAllRoundDetailByRoundId(round.id);
  const json = JSON.stringify(detail);
  const detailItem = JSON.parse(json);
  console.log(detailItem);

  const dataSort = await sortResult(
    detailItem,
    transformedData,
    replyToken,
    round.round,
    groupId
  );

  // console.log(JSON.stringify(dataSort[2], null, 2));
  // return;
  if (dataSort[2].length !== 0) {
    let sumTotal = 0;
    let sumBroken = 0;
    let sumUnit = 0;
    for (const item of dataSort[2]) {
      item.data.forEach((play) => {
        if (play.isDeduction) {
          sumUnit += play.unit * 2;
        } else {
          sumUnit += play.unit;
        }
      });
      sumTotal += item.balance;
      sumBroken += item.totalBroken;
      const user = await usersService.getCreadit(item.userId);
      const newCredit = user.credit + item.total;
      await usersService.addCredit(newCredit, item.userId);
    }
    const close = await roundService.closeStatus(round.id, groupId);
    const total = await roundService.updateTotal(round.id, sumUnit, sumBroken);
    if (close && total) {
      results = [];
      messageTotal = "";
      BotEvent.replyMessage(replyToken, {
        type: "text",
        text: "อัพเดทยอดเรียบร้อย 🎊",
      });
    }
  } else {
    BotEvent.replyMessage(replyToken, {
      type: "text",
      text: "อัพเดทยอดเรียบร้อย 🎊",
    });
    await roundService.closeStatus(round.id, groupId);
    results = [];
    messageTotal = "";
  }

  return;
  let sumTotal = 0;
  let sumBroken = 0;
  let sumUnit = 0;
  let diff = 0;
  const filteredPlayArray = results.map((item) => ({
    ...item,
    play: item.play.filter((playItem) => playItem.unit !== 0),
  }));

  filteredPlayArray.forEach((item) => {
    item.play.forEach((play) => {
      if (play.isDeduction) {
        sumUnit += play.unit * 2;
      } else {
        sumUnit += play.unit;
      }
    });
    sumTotal += item.total;
    sumBroken += item.totalBroken;
  });

  if (results.length !== 0) {
    for (const item of results) {
      const user = await usersService.getCreadit(item.id);
      const newCredit = user.credit + item.total;
      await usersService.addCredit(newCredit, item.id);
    }
    const close = await roundService.closeStatus(round.id, groupId);
    const total = await roundService.updateTotal(round.id, sumUnit, sumBroken);
    if (close && total) {
      results = [];
      messageTotal = "";
      BotEvent.replyMessage(replyToken, {
        type: "text",
        text: "อัพเดทยอดเรียบร้อย 🎊",
      });
    }
  } else {
    BotEvent.replyMessage(replyToken, {
      type: "text",
      text: "อัพเดทยอดเรียบร้อย 🎊",
    });
    await roundService.closeStatus(round.id, groupId);
    results = [];
    messageTotal = "";
  }
};

const cancel = async (replyToken, userId, groupId) => {
  try {
    const round = await roundService.getRoundIdinProgress(groupId);
    console.log(round);
    const isRound = await roundService.getRoundIdinProgress(groupId);
    if (round !== null) {
      const id = await usersService.getIdByUUid(userId);

      const tempData = await roundService.getAllRoundDetailByRoundIdAndUserId(
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
      msgString += `👤 คุณ ${user.data.displayName}\n`;
      const val = await usersService.getCreaditByuserId(userId);
      if (total > 0) {
        msgString += "-------------------\n\n";
        msgString += `❌ ยกเลิกของรอบ ${isRound.round}\n\n`;
        msgString += "-------------------\n";
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
    } else {
      BotEvent.replyMessage(replyToken, {
        type: "text",
        text: "ไม่สารถยกเลิกได้",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const playPok = async (replyToken, userId, groupId, message) => {
  try {
    const searchRegex = /[=\/]/g; // This regex matches '=' or '/' globally
    const matches = message.match(searchRegex) ?? [];
    console.log(matches);
    if (matches.length > 0) {
      const round = await roundService.getCountRoundInProgress(groupId);
      console.log(`round ${round}`);
      const isRound = await roundService.getRoundIdinProgress(groupId);
      if (isRound) {
        const id = await usersService.getIdByUUid(userId);
        const resultArray = message.split("\n");

        const resultObjects = [];
        console.log(resultArray);

        let total = 0;
        //ยอดที่รับมา
        resultArray.forEach((item) => {
          const [, key, value] = item.match(/(.+)\/(\d+)$/);
          console.log(key);
          console.log(value);
          let obj = {};
          if (key.length === 1) {
            if (
              key === "1" ||
              key === "2" ||
              key === "3" ||
              key === "4" ||
              key === "5" ||
              key === "6"
            ) {
              obj = {
                name: "k" + key,
                unit: parseInt(value, 10),
                fight: "k0",
              };
              resultObjects.push(obj);
            }
          } else if (key.length === 2) {
            let array = Array.from(key);
            console.log(array);

            obj = {
              name: "k" + array[0] === "kจ" ? "k0" : "k" + array[0],
              unit: parseInt(value, 10),
              fight: "k" + array[1],
            };
            resultObjects.push(obj);
            // if (key.split("s")[1] === "5" || key.split("s")[1] === "9") {
            // }
          }
        });
        console.log(resultObjects);
        const resultMap = new Map();

        // Iterate over the input data and aggregate values
        resultObjects.forEach((entry) => {
          const key = entry.name + "-" + entry.fight;
          if (resultMap.has(key)) {
            resultMap.get(key).unit += entry.unit;
          } else {
            resultMap.set(key, {
              name: entry.name,
              unit: entry.unit,
              fight: entry.fight,
            });
          }
        });

        // Convert the map values back to an array
        const outputData = Array.from(resultMap.values());

        if (resultObjects.length !== 0) {
          const sumData = [
            { name: "k0", unit: 0 },
            { name: "k1", unit: 0 },
            { name: "k2", unit: 0 },
            { name: "k3", unit: 0 },
            { name: "k4", unit: 0 },
            { name: "k5", unit: 0 },
            { name: "k6", unit: 0 },
          ];

          resultObjects.forEach((item1) => {
            sumData.forEach((item2) => {
              if (item1.name === item2.name) {
                item2.unit += item1.unit;
              }
            });
          });
          console.log(sumData);
          // return;
          const to2000 = sumData.filter((item) => item.unit > 2000).length;
          const noi50 = sumData.filter(
            (item) => item.unit < 10 && item.unit !== 0
          ).length;

          if (to2000 !== 0 && noi50 !== 0) {
            BotEvent.replyMessage(replyToken, {
              type: "text",
              text: "ไม่สามารถเดิมพันได้น้อยกว่า 10 บาท/ขา หรือ มากกว่า 2000 บาท/ขา",
            });
            return;
          } else if (noi50 !== 0) {
            BotEvent.replyMessage(replyToken, {
              type: "text",
              text: "ไม่สามารถเดิมพันได้น้อยกว่า 10 บาท/ขา",
            });
            return;
          } else if (to2000 !== 0) {
            BotEvent.replyMessage(replyToken, {
              type: "text",
              text: "ไม่สามารถเดิมพันได้เกิน 2000 บาท/ขา",
            });
            return;
          }
          // const oldData = [
          //   { name: "k0", unit: 0 },
          //   { name: "k1", unit: 0 },
          //   { name: "k2", unit: 0 },
          //   { name: "k3", unit: 0 },
          //   { name: "k4", unit: 0 },
          //   { name: "k5", unit: 0 },
          //   { name: "k6", unit: 0 },
          // ];
          // const tempOldData = [
          //   { name: "k1", unit: 0, isAdd: false },
          //   { name: "k2", unit: 0, isAdd: false },
          //   { name: "k3", unit: 0, isAdd: false },
          //   { name: "k4", unit: 0, isAdd: false },
          //   { name: "k5", unit: 0, isAdd: false },
          //   { name: "k6", unit: 0, isAdd: false },
          // ];
          // const tempData =
          //   await roundService.getAllRoundDetailByRoundIdAndUserId(
          //     isRound.id,
          //     id.id
          //   );
          // // convert tempData to json
          // const json = JSON.stringify(tempData);
          // const detailItem = JSON.parse(json);
          // console.log(detailItem);
          // if (detailItem.length !== 0) {
          //   oldData.forEach((item2) => {
          //     detailItem.forEach((item) => {
          //       if (item2.name === item.ka) {
          //         parseInt((item2.unit += item.unit));
          //       }
          //     });
          //   });
          // }
          // tempOldData.forEach((item2) => {
          //   detailItem.forEach((item) => {
          //     if (item2.name === item.ka) {
          //       parseInt((item2.unit += item.unit));
          //     }
          //   });
          // });

          // let tempTotal = 0;
          // //ยอดเก่า <--
          // // check ยอดรวมกันถึง 2000 บาทไหม -->
          // let check2000 = false;
          // if (resultObjects.length > 0) {
          //   oldData.forEach((item1, index1) => {
          //     const matchingItem = resultObjects.find(
          //       (item2) => item2.name === item1.name
          //     );
          //     let x = 0;
          //     if (matchingItem) {
          //       x = oldData[index1].unit += matchingItem.unit;
          //       if (x > 2000) {
          //         check2000 = true;
          //       }
          //     }
          //   });
          // }

          // if (check2000) {
          //   BotEvent.replyMessage(replyToken, {
          //     type: "text",
          //     text: "ไม่สามารถเดิมพันได้เกิน 2000 บาท/ขา",
          //   });
          //   check2000 = false;
          //   return;
          // }
          // check ยอดรวมกันถึง 2000 บาทไหม <--

          //

          const data = [
            {
              name: "k0",
              unitTotal: 0,
              fight: [
                {
                  name: "k1",
                  unit: 0,
                },
                {
                  name: "k2",
                  unit: 0,
                },
                {
                  name: "k3",
                  unit: 0,
                },
                {
                  name: "k4",
                  unit: 0,
                },
                {
                  name: "k5",
                  unit: 0,
                },
                {
                  name: "k6",
                  unit: 0,
                },
              ],
            },
            // {
            //   name: "k1",
            //   unit: 0,
            //   balance: 0,
            //   isDeduction: false,
            // },
            // {
            //   name: "k2",
            //   unit: 0,
            //   balance: 0,
            //   isDeduction: false,
            // },
            // {
            //   name: "k3",
            //   unit: 0,
            //   balance: 0,
            //   isDeduction: false,
            // },
            // {
            //   name: "k4",
            //   unit: 0,
            //   balance: 0,
            //   isDeduction: false,
            // },
            // {
            //   name: "k5",
            //   unit: 0,
            //   balance: 0,
            //   isDeduction: false,
            // },
            // {
            //   name: "k6",
            //   unit: 0,
            //   balance: 0,
            //   isDeduction: false,
            // },
            // {
            //   name: "k1",
            //   unit: 0,
            //   balance: 0,
            //   isDeduction: true,
            // },
            // {
            //   name: "k2",
            //   unit: 0,
            //   balance: 0,
            //   isDeduction: true,
            // },
            // {
            //   name: "k3",
            //   unit: 0,
            //   balance: 0,
            //   isDeduction: true,
            // },
            // {
            //   name: "k4",
            //   unit: 0,
            //   balance: 0,
            //   isDeduction: true,
            // },
            // {
            //   name: "k5",
            //   unit: 0,
            //   balance: 0,
            //   isDeduction: true,
            // },
            // {
            //   name: "k6",
            //   unit: 0,
            //   balance: 0,
            //   isDeduction: true,
            // },
          ];
          // const allUnitsNotZero = oldData.every((item) => item.unit === 0);

          //  รวมยอกทั้งหมด
          let msgString = "";
          if (true) {
            const user = await BotEvent.getProfileInGroupById(groupId, userId);
            msgString += `👤 คุณ ${user.data.displayName}\n`;
            msgString += "-------------------\n";
            outputData.map((item) => {
              total += item.unit;
              // msgString += `✅ ขา ${item.name.charAt(1)} = ${
              //   item.unit
              // } บ.\n`;
            });
            //เช็คยอด
            const val = await usersService.getCreaditByuserId(userId);
            let isCheck = false;
            let isDeduction = false;
            if (val.credit >= total * 2) {
              total = total * 2;
              isDeduction = true;
              // resultObjects.map((item1) => {
              //   data.forEach((item2) => {
              //     if (item1.name === item2.name && item2.isDeduction === true) {
              //       item2.unit += item1.unit;
              //     }
              //   });
              // });
            } else if (val.credit >= total) {
              total = total;
              isDeduction = false;
              // resultObjects.map((item1) => {
              //   data.forEach((item2) => {
              //     if (
              //       item1.name === item2.name &&
              //       item2.isDeduction === false
              //     ) {
              //       item2.unit += item1.unit;
              //     }
              //   });
              // });
            } else {
              isCheck = true;
              isDeduction = false;
              BotEvent.replyMessage(replyToken, {
                type: "text",
                text: "ยอดเงินไม่พอ",
              });
              return;
            }

            // return;
            //เหลือ Update Credit

            //save RoundDetail

            // tempOldData.forEach((item) => {
            //   data.forEach((item2) => {
            //     if (item.name === item2.name) {
            //       if (item.unit !== 0 && item2.unit !== 0) {
            //         item.unit = item2.unit;
            //         item.isAdd = true;
            //       } else {
            //         item.unit = item2.unit;
            //       }
            //     }
            //   });
            // });
            // const filterTempOldData = tempOldData.filter(
            //   (item) => item.unit !== 0
            // );
            // console.log(filterTempOldData);
            // return;
            if (!isCheck) {
              if (id) {
                // const saveData = data.filter((item) => item.unit !== 0);
                const roundDetailData = [];
                outputData.forEach((item) => {
                  const obj = {
                    roundId: isRound.id,
                    userId: id.id,
                    ka: item.name,
                    fight: item.fight,
                    unit: parseInt(item.unit),
                    isCancel: false,
                    isDeduction: isDeduction,
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
                    let ka = "";
                    if (item.ka === "k0" && item.fight !== "k0") {
                      ka = `จ${item.fight.charAt(1)}`;
                    }
                    if (item.ka !== "k0" && item.fight === "k0") {
                      ka = `${item.ka.charAt(1)}`;
                    }
                    if (item.ka !== "k0" && item.fight !== "k0") {
                      ka = `${item.ka.charAt(1)}${item.fight.charAt(1)}`;
                    }
                    msgString += `\n✅ ขา ${ka} = ${item.unit} บ. `;
                  });
                  const checkisDeduction = roundDetailData.every(
                    (item) => item.isDeduction === false
                  );
                  msgString += "\n\n-------------------";
                  msgString += `\n${
                    checkisDeduction ? "⬅️หักไม่เล่นเด้ง" : "⬅️หักล่วงหน้า"
                  }  ${total} บ.\n`;
                  msgString += `💵คงเหลือ ${val.credit - total} บ.`;
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
        }
        //ยอดเก่า -->
      } else {
        BotEvent.replyMessage(replyToken, {
          type: "image",
          originalContentUrl: "https://hook.nuenghub-soft.online/img/w13.png",
          previewImageUrl: "https://hook.nuenghub-soft.online/img/w13.png",
        });
      }
    }
  } catch (error) {
    return;
  }
};
module.exports = {
  hookMessageLine,
};
