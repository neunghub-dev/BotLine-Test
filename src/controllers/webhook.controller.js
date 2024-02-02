//import helper
const BotEvent = require("../helper/BotEvent");
const usersService = require("../services/users.service");
const roundService = require("../services/round.service");
const transactionService = require("../services/transaction.service");
const flex = require("../constants/flexMesaage");
const UserAdmin = require("../services/users_admin.service");
const partnerService = require("../services/partner.service");
// ctrl + f go to KeyWord Function
// KeyWord Check Credit
// KeyWord Cancel
// KeyWord OpenRound
// KeyWord CloseRound

const hookMessageLine = async (req, res) => {
  try {
    if (req.body.events.length !== 0) {
      let destination = req.body.destination;
      const pn = await partnerService.getPartnerByDestination(destination);
      let token = pn.token;
      if (req.body.events[0].message.type === "text") {
        const message = req.body.events[0].message.text;
        const replyToken = req.body.events[0].replyToken;
        const userId = req.body.events[0].source.userId;
        const groupId = req.body.events[0].source.groupId;
        const checkUser = await UserAdmin.checkUser(userId);

        try {
          // KeyWord Check Credit
          if (
            message === "เช็คยอด" ||
            message === "check" ||
            message === "c" ||
            message === "C" ||
            message === "Check"
          ) {
            checkCredit(replyToken, userId, groupId, token);
          } else if (message === "x" || message === "X") {
            cancel(replyToken, userId, groupId, token);
          } else {
            playPok(replyToken, userId, groupId, message, token);
          }
        } catch (error) {
          console.log(error);
          return;
        }
        if (checkUser) {
          // OpenRound

          if (message === "o" || message === "O") {
            await openRound(replyToken, userId, groupId, token);
          } else if (message === "CC" || message === "cc") {
            await cancelRound(replyToken, userId, groupId, token);
          } else if (message === "y" || message === "Y") {
            await closeRound(replyToken, userId, groupId, token);
          } else if (
            (message.charAt(0) === "s" || message.charAt(0) === "S") &&
            message.split(",").length === 7
          ) {
            await sentResult(replyToken, userId, groupId, message, token);
          } else if (message === "cf" || message === "Cf" || message === "CF") {
            await confirmRound(replyToken, userId, groupId, token);
          } else if (message === "show") {
            const round = await roundService.getBeforRound(groupId);
            const json = JSON.stringify(round);
            const roundItem = JSON.parse(json);
            console.log(roundItem);
            return
            const isRound = await roundService.getRoundIdinProgress(groupId);

            if (isRound === null) {
              const data = {
                message: "ไม่มีรอบที่กำลังเปิดอยู่",
                replyToken: replyToken,
              };
              return await BotEvent.replyMessage(
                replyToken,
                {
                  type: "image",
                  originalContentUrl:
                    "https://hook.nuenghub-soft.online/img/w13.png",
                  previewImageUrl:
                    "https://hook.nuenghub-soft.online/img/w13.png",
                },
                token
              );
            } else {
              const detail = await roundService.getAllRoundDetailByRoundId(
                isRound.id
              );
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
                await BotEvent.replyMessage(
                  replyToken,
                  {
                    type: "text",
                    text: `ยกเลิกรอบที่ ${isRound.round} เรียบร้อย ❌`,
                  },
                  token
                );
              }
            }
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
const showAll = async (data, gId, round, token) => {
  let msgString = "";
  msgString += `✅ สรุปรายการแทงรอบที่ ${round} \n`;
  if (data.length !== 0) {
    for await (const entry of data) {
      const userLine = await BotEvent.getProfileInGroupById(
        gId,
        entry.uuid,
        token
      );
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

const checkCredit = async (replyToken, userId, groupId, token) => {
  const val = await usersService.getCreaditByuserId(userId);
  const credit = val.credit;

  const user = await BotEvent.getProfileInGroupById(groupId, userId, token);
  const data = {
    name: user.data.displayName,
    replyToken: replyToken,
    credit: credit.toLocaleString(),
  };

  await BotEvent.getCreadit(data, token);
};

const openRound = async (replyToken, userId, groupId, token) => {
  const isRound = await roundService.checkRoundInprogress(groupId);
  if (isRound) {
    return await BotEvent.replyMessage(
      replyToken,
      {
        type: "text",
        text: "มีรอบที่กำลังเปิดอยู่",
      },
      token
    );
  } else {
    const date = new Date();
    // const formattedDate = date.toISOString().split("T")[0].toString();
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

const closeRound = async (replyToken, userId, groupId, token) => {
  const isRound = await roundService.getRoundIdinProgress(groupId);
  if (isRound === null) {
    return await BotEvent.replyMessage(
      replyToken,
      {
        type: "image",
        originalContentUrl: "https://hook.nuenghub-soft.online/img/w13.png",
        previewImageUrl: "https://hook.nuenghub-soft.online/img/w13.png",
      },
      token
    );
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
      console.log(detailItem);
      const dataSort = await sortResult(
        detailItem,
        null,
        replyToken,
        round.round,
        groupId
      );
      const data1 = [];
      for (let i of dataSort[2]) {
        let res = "";
        for (let n of i.data) {
          res += `ขา${n.ka === "k0" ? "จ" : n.ka.charAt(1)}${
            n.fight === "k0" ? "" : n.fight.charAt(1)
          }=${n.unit}บ.`;
        }
        console.log();
        const userLine = await BotEvent.getProfileInGroupById(
          groupId,
          i.User.uuid_line,
          token
        );
        const data = {
          name:
            userLine?.data === undefined
              ? "ไม่พบผู้ใช้"
              : userLine.data.displayName,
          unit: res,
        };
        data1.push(data);
      }

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
                text: `สรุปการเดิมพันรอบที่ ${isRound.round}`,
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
      await BotEvent.showResultClose(
        replyToken,
        [
          {
            type: "image",
            originalContentUrl: "https://hook.nuenghub-soft.online/img/w11.png",
            previewImageUrl: "https://hook.nuenghub-soft.online/img/w11.png",
          },
          allData,
        ],
        1,
        token
      );
    }
    return;
  }
};

const cancelRound = async (replyToken, userId, groupId, token) => {
  const isRound = await roundService.getRoundIdinProgress(groupId);

  if (isRound === null) {
    const data = {
      message: "ไม่มีรอบที่กำลังเปิดอยู่",
      replyToken: replyToken,
    };
    return await BotEvent.replyMessage(
      replyToken,
      {
        type: "image",
        originalContentUrl: "https://hook.nuenghub-soft.online/img/w13.png",
        previewImageUrl: "https://hook.nuenghub-soft.online/img/w13.png",
      },
      token
    );
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
      await BotEvent.replyMessage(
        replyToken,
        {
          type: "text",
          text: `ยกเลิกรอบที่ ${isRound.round} เรียบร้อย ❌`,
        },
        token
      );
    }
  }
};

const sentResult = async (replyToken, userId, groupId, message, token) => {
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
        groupId,
        token
      );
      console.log(JSON.stringify(dataSort, null, 2));
      await BotEvent.showResult(replyToken, dataSort, round.round, token);
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
    BotEvent.replyMessage(
      replyToken,
      {
        type: "text",
        text: "กรุณาปิดรอบก่อนสรุปผล",
      },
      token
    );
  }
};
const sortResult = async (
  res,
  results,
  replyToken,
  roundNo,
  groupId,
  token
) => {
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
  if (results !== null) {
    for (const userItem of finalResult) {
      for (const kaItem of userItem.data) {
        const result = await calculateResult(kaItem, results, token);
        kaItem.income = result.income;
        kaItem.balance = result.total;
        kaItem.totalBroken = result.broken;
        kaItem.net = result.net;
        kaItem.status = result.status;
      }
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
      i.User.uuid_line,
      token
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
  // console.log(JSON.stringify(finalResult, null, 2));

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
const calculateResult = async (data, result, token) => {
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
  dataPlayer.kaItem = ka.isLeader
    ? parseFloat(ka.number.split("s")[1].slice(1))
    : parseFloat(ka.number.slice(1));
  dataPlayer.fightItem = fg.isLeader
    ? parseFloat(fg.number.split("s")[1].slice(1))
    : parseFloat(fg.number.slice(1));
  console.log(dataPlayer);
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
          console.log(1);
          dataPlayer.total = dataPlayer.unit * 2;
          dataPlayer.deduction = dataPlayer.unit * 2 - dataPlayer.unit;
          dataPlayer.net += dataPlayer.unit * 2;
          dataPlayer.income = dataPlayer.unit * 2;
        } else {
          console.log(2);
          dataPlayer.total = dataPlayer.unit;
          dataPlayer.deduction = 0;
          dataPlayer.net += dataPlayer.unit;
          dataPlayer.income = dataPlayer.unit;
        }
      } else {
        if (dataPlayer.isDeduction) {
          console.log(3);
          dataPlayer.total = dataPlayer.unit;
          dataPlayer.deduction = dataPlayer.unit * 2 - dataPlayer.unit;
          dataPlayer.net += dataPlayer.unit;
          dataPlayer.income = dataPlayer.unit;
        } else {
          console.log(4);
          dataPlayer.total = dataPlayer.unit;
          dataPlayer.deduction = 0;
          dataPlayer.net += dataPlayer.unit;
          dataPlayer.income = dataPlayer.unit;
        }
      }
    }
  } else {
    if (dataPlayer.status === "winner") {
      if (dataPlayer.isPok === true) {
        if (dataPlayer.isDeduction) {
          console.log(5);
          dataPlayer.total = Math.floor((dataPlayer.unit * 2 * 90) / 100);
          dataPlayer.deduction = dataPlayer.unit * 2 - dataPlayer.unit;
          dataPlayer.net += dataPlayer.unit * 2;
          dataPlayer.income = Math.floor((dataPlayer.unit * 2 * 90) / 100);
        } else {
          console.log(6);
          dataPlayer.total = Math.floor((dataPlayer.unit * 90) / 100);
          dataPlayer.deduction = 0;
          dataPlayer.net += dataPlayer.unit;
          dataPlayer.income = Math.floor((dataPlayer.unit * 90) / 100);
        }
      } else {
        if (dataPlayer.isDeduction) {
          console.log(7);
          dataPlayer.total = Math.floor((dataPlayer.unit * 90) / 100);
          dataPlayer.deduction = dataPlayer.unit * 2 - dataPlayer.unit;
          dataPlayer.net += dataPlayer.unit;
          dataPlayer.income = Math.floor((dataPlayer.unit * 90) / 100);
        } else {
          console.log(8);
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
const confirmRound = async (replyToken, userId, groupId, token) => {
  const round = await roundService.getCloseRoundAndinProgress(groupId);
  const result = [
    `s${round.k0}`,
    round.k1,
    round.k2,
    round.k3,
    round.k4,
    round.k5,
    round.k6,
  ];
  // const countOfNull = result.filter((value) => value === null).length;
  // if (countOfNull === 0) {

  // }
  const transformedSequence = [];
  for (let n in result) {
    const data = {
      name: `k${n}`,
      number: result[n],
      convertNumber: convertPokNumber(result[n]),
    };
    transformedSequence.push(data);
  }

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

  const detail = await roundService.getAllRoundDetailByRoundId(round.id);
  const json = JSON.stringify(detail);
  const detailItem = JSON.parse(json);

  const dataSort = await sortResult(
    detailItem,
    transformedData,
    replyToken,
    round.round,
    groupId,
    token
  );

  if (dataSort[2].length !== 0) {
    let sumTotal = 0;
    let sumBroken = 0;
    let sumUnit = 0;
    for (const item of dataSort[2]) {
      const total = item.totalIncome - item.totalBroken;
      if (total !== 0) {
        const transactionData = {
          event: total < 0 ? "lose" : "win",
          unit: total,
          userId: item.userId,
          adminId: 2,
        };

        await transactionService.createTransaction(transactionData);
      }
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
      BotEvent.replyMessage(
        replyToken,
        {
          type: "text",
          text: "อัพเดทยอดเรียบร้อย 🎊",
        },
        token
      );
    }
  } else {
    BotEvent.replyMessage(
      replyToken,
      {
        type: "text",
        text: "อัพเดทยอดเรียบร้อย 🎊",
      },
      token
    );
    await roundService.closeStatus(round.id, groupId);
  }
  return;
};

const cancel = async (replyToken, userId, groupId, token) => {
  try {
    const round = await roundService.getRoundIdinProgress(groupId);
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
      const user = await BotEvent.getProfileInGroupById(groupId, userId, token);
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
        BotEvent.replyMessage(
          replyToken,
          {
            type: "text",
            text: msgString,
          },
          token
        );
      }

      return;
    } else {
      BotEvent.replyMessage(
        replyToken,
        {
          type: "text",
          text: "ไม่สารถยกเลิกได้",
        },
        token
      );
    }
  } catch (error) {
    console.log(error);
  }
};

const playPok = async (replyToken, userId, groupId, message, token) => {
  try {
    const searchRegex = /[=\/]/g; // This regex matches '=' or '/' globally
    const matches = message.match(searchRegex) ?? [];

    if (matches.length > 0) {
      const round = await roundService.getCountRoundInProgress(groupId);
      const isRound = await roundService.getRoundIdinProgress(groupId);
      if (isRound) {
        const id = await usersService.getIdByUUid(userId);
        const resultArray = message.split("\n");
        const resultObjects = [];

        let total = 0;
        //ยอดที่รับมา
        resultArray.forEach((item) => {
          const [, key, value] = item.match(/(.+)\/(\d+)$/);
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
                ka: "k" + key,
                unit: parseInt(value, 10),
                fight: "k0",
              };
              resultObjects.push(obj);
            }
          } else if (key.length === 2) {
            let array = Array.from(key);
            console.log(array);
            let checkKa = false;
            let checkFight = false;
            if (
              array[0] === "จ" ||
              array[0] === "1" ||
              array[0] === "2" ||
              array[0] === "3" ||
              array[0] === "4" ||
              array[0] === "5" ||
              array[0] === "6"
            ) {
              checkKa = true;
            } else {
              checkKa = false;
            }
            if (
              array[1] === "จ" ||
              array[1] === "1" ||
              array[1] === "2" ||
              array[1] === "3" ||
              array[1] === "4" ||
              array[1] === "5" ||
              array[1] === "6"
            ) {
              checkFight = true;
            } else {
              checkFight = false;
            }

            if (
              checkKa &&
              checkFight &&
              array[0].toString() !== array[1].toString()
            ) {
              obj = {
                ka: "k" + array[0] === "kจ" ? "k0" : "k" + array[0],
                unit: parseInt(value, 10),
                fight: "k" + array[1],
              };
              resultObjects.push(obj);
            }
            // if (key.split("s")[1] === "5" || key.split("s")[1] === "9") {
            // }
          }
        });
        console.log(resultObjects);
        const resultMap = new Map();

        // Iterate over the input data and aggregate values
        resultObjects.forEach((entry) => {
          const key = entry.ka + "-" + entry.fight;
          if (resultMap.has(key)) {
            resultMap.get(key).unit += entry.unit;
          } else {
            resultMap.set(key, {
              ka: entry.ka,
              unit: entry.unit,
              fight: entry.fight,
            });
          }
        });
        // Convert the map values back to an array
        const outputData = Array.from(resultMap.values());

        if (resultObjects.length !== 0) {
          const sumData = Object.values(
            resultObjects.reduce((acc, { ka, unit, fight }) => {
              const key = ka + fight;
              acc[key] = acc[key] || { ka, fight, unit: 0 };
              acc[key].unit += unit;
              return acc;
            }, {})
          );

          const to2000 = sumData.filter((item) => item.unit > 2000).length;
          const noi50 = sumData.filter(
            (item) => item.unit < 10 && item.unit !== 0
          ).length;

          if (to2000 !== 0 && noi50 !== 0) {
            return BotEvent.replyMessage(
              replyToken,
              {
                type: "text",
                text: "ไม่สามารถเดิมพันได้น้อยกว่า 10 บาท/ขา หรือ มากกว่า 2000 บาท/ขา",
              },
              token
            );
          } else if (noi50 !== 0) {
            return BotEvent.replyMessage(
              replyToken,
              {
                type: "text",
                text: "ไม่สามารถเดิมพันได้น้อยกว่า 10 บาท/ขา",
              },
              token
            );
          } else if (to2000 !== 0) {
            return BotEvent.replyMessage(
              replyToken,
              {
                type: "text",
                text: "ไม่สามารถเดิมพันได้เกิน 2000 บาท/ขา",
              },
              token
            );
          }

          const tempData =
            await roundService.getAllRoundDetailByRoundIdAndUserId(
              isRound.id,
              id.id
            );
          // // convert tempData to json
          const json = JSON.stringify(tempData);
          const detailItem = JSON.parse(json);

          let checkKa2000 = false;
          let output = "";

          if (detailItem.length !== 0) {
            const dataSort = await sortResult(
              detailItem,
              null,
              replyToken,
              isRound.round,
              groupId
            );

            const combinedData = [...dataSort[2][0].data, ...sumData];

            // Sum the unit values based on the combination of name and fight
            output = Object.values(
              combinedData.reduce((acc, { ka, fight, unit, name }) => {
                const key = ka + fight;
                acc[key] = acc[key] || { ka, fight, unit: 0 };
                acc[key].unit += unit;
                return acc;
              }, {})
            );

            console.log(output);

            output.forEach((item) => {
              if (item.unit > 2000) {
                checkKa2000 = true;
              }
            });

            console.log("End");
          }
          // return;

          if (checkKa2000) {
            checkKa2000 = false;
            return BotEvent.replyMessage(
              replyToken,
              {
                type: "text",
                text: "ไม่สามารถเดิมพันได้เกิน 2000 บาท/ขา",
              },
              token
            );
          }
          // check ยอดรวมกันถึง 2000 บาทไหม <--

          //

          let msgString = "";
          if (!checkKa2000) {
            const user = await BotEvent.getProfileInGroupById(
              groupId,
              userId,
              token
            );

            msgString += `👤 คุณ ${user.data.displayName}\n`;
            msgString += "-------------------\n";
            outputData.map((item) => {
              total += item.unit;
            });
            //เช็คยอด
            const val = await usersService.getCreaditByuserId(userId);
            let isCheck = false;
            let isDeduction = false;
            if (val.credit >= total * 2) {
              total = total * 2;
              isDeduction = true;
            } else if (val.credit >= total) {
              total = total;
              isDeduction = false;
            } else {
              isCheck = true;
              isDeduction = false;
              return BotEvent.replyMessage(
                replyToken,
                {
                  type: "text",
                  text: "ยอดเงินไม่พอ",
                },
                token
              );
            }

            if (!isCheck) {
              if (id) {
                const roundDetailData = [];
                outputData.forEach((item) => {
                  const obj = {
                    roundId: isRound.id,
                    userId: id.id,
                    ka: item.ka,
                    fight: item.fight,
                    unit: parseInt(item.unit),
                    isCancel: false,
                    isDeduction: isDeduction,
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

                // const transactionData = {
                //   event: "play",
                //   unit: total,
                //   userId: parseInt(id.id),
                //   adminId: 2,
                // };
                // const createTransaction =
                //   transactionService.createTransaction(transactionData);

                if (updateCredit && addRoundDetail) {
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
                  return BotEvent.replyMessage(
                    replyToken,
                    {
                      type: "text",
                      text: msgString,
                    },
                    token
                  );
                }
              } else {
                return BotEvent.replyMessage(
                  replyToken,
                  {
                    type: "text",
                    text: "ไม่พบข้อมูลผู้ใช้",
                  },
                  token
                );
              }
            }
          }
        }
        //ยอดเก่า -->
      } else {
        return BotEvent.replyMessage(
          replyToken,
          {
            type: "image",
            originalContentUrl: "https://hook.nuenghub-soft.online/img/w13.png",
            previewImageUrl: "https://hook.nuenghub-soft.online/img/w13.png",
          },
          token
        );
      }
    }
  } catch (error) {
    return;
  }
};
module.exports = {
  hookMessageLine,
};
