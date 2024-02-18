const axios = require("axios");
const flex = require("../constants/flexMesaage");

const openRound = async (data, token) => {
  const dataMsg = data;
  await replyMessage(dataMsg.replyToken, flex.startRound(data.message), token);
};

const getCreadit = async (data, token) => {
  await replyMessage(data.replyToken, flex.checkCredit(data), token);
};
const showResultNotPlayer = async (replyToken, data, round, token) => {
  await replyMessage(
    replyToken,
    [flex.showResult(data[0], round), data[1]],
    token
  );
};
const showResult = async (replyToken, data, round, token) => {
  await replyMessage(
    replyToken,
    [flex.showResult(data[0], round), flex.showResultAll(data[1])],
    token
  );
};
const showResultClose = async (replyToken, data, round, token) => {
  await replyMessage(replyToken, [data[0], flex.showResultAll(data[1])], token);
};
const replyMessage = (replyToken, message, token) => {
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
      Authorization: `Bearer ${token}`,
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
const getProfileInGroupById = async (groupId, userId, token) => {
  try {
    return await axios.get(
      `https://api.line.me/v2/bot/group/${groupId}/member/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    return; // Handle the error as needed
    console.error(error);
  }
};
const getProfile = async (userId, token) => {
  try {
    return await axios.get(`https://api.line.me/v2/bot/profile/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    return; // Handle the error as needed
    console.error(error);
  }
};
module.exports = {
  showResultNotPlayer,
  showResultClose,
  getProfile,
  getProfileInGroupById,
  getCreadit,
  openRound,
  replyMessage,
  showResult,
};
