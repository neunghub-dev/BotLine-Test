const axios = require("axios");
const flex = require("../constants/flexMesaage");

const openRound = async (data) => {
  const dataMsg = data;
  await replyMessage(dataMsg.replyToken, flex.startRound(data.message), {
    type: "image",
    originalContentUrl: "https://hook.nuenghub-soft.online/img/w12.png",
    previewImageUrl: "https://hook.nuenghub-soft.online/img/w12.png",
  });
};

const getCreadit = async (data) => {
  await replyMessage(data.replyToken, flex.checkCredit(data));
};

const showResult = async (replyToken, data, round) => {
  await replyMessage(replyToken, [
    flex.showResult(data[0], round),
    flex.showResultAll(data[1]),
  ]);
};
const showResultClose = async (replyToken, data, round) => {
  await replyMessage(replyToken, [data[0], flex.showResultAll(data[1])]);
};
const replyMessage = (replyToken, message) => {
  console.log(message);
  const data = [];
  if (message.length > 1) {
    message.forEach((element) => {
      data.push(element);
    });
  } else {
    data.push(message);
  }

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api.line.me/v2/bot/message/reply",
    headers: {
      Authorization:
        "Bearer nUBRigFgMx0ZiILPCnRGSOlfAwuv7+QzsqNMA2yunGWfzM+7yjbRQ/tsJEXzn5UdjknV5WdQp2wXWV+nSf+PKHDiHZXcvWcuHBop4ELnRLnRhe7UbknyYuMEQKrmG7c4xllLS/u7SlPU2NX+06z2dgdB04t89/1O/w1cDnyilFU=",
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      replyToken: replyToken,
      messages: [...data],
    }),
  };

  axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.error(error.response);
      return;
    });
};
const getProfileInGroupById = async (groupId, userId) => {
  try {
    return await axios.get(
      `https://api.line.me/v2/bot/group/${groupId}/member/${userId}`,
      {
        headers: {
          Authorization:
            "Bearer nUBRigFgMx0ZiILPCnRGSOlfAwuv7+QzsqNMA2yunGWfzM+7yjbRQ/tsJEXzn5UdjknV5WdQp2wXWV+nSf+PKHDiHZXcvWcuHBop4ELnRLnRhe7UbknyYuMEQKrmG7c4xllLS/u7SlPU2NX+06z2dgdB04t89/1O/w1cDnyilFU=",
        },
      }
    );
  } catch (error) {
    return; // Handle the error as needed
    console.error(error);
  }
};
module.exports = {
  showResultClose,
  getProfileInGroupById,
  getCreadit,
  openRound,
  replyMessage,
  showResult,
};
