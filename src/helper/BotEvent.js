const axios = require("axios");
const flex = require("../constants/flexMesaage");

const openRound = async (data) => {
  const dataMsg = data;
  await replyMessage(dataMsg.replyToken, flex.startRound(data.message));
};

const getCreadit = async (data) => {
  await replyMessage(data.replyToken, flex.checkCredit(data));
};

const showResult = async (replyToken, data) => {
  console.log("-----------------");
  console.log(data[1]);
  console.log("-----------------");
  await replyMessage(replyToken, [
    flex.showResult(data[0]),
    {
      type: "text",
      text: data[1],
    },
  ]);
};
const replyMessage = (replyToken, message) => {
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
        "Bearer Ww+VXPtfsqj1kn1WX2aOqM3KTJLJqvfudBt3qTQel/dSzNbnelibvBNvoF1jxXOuHjqfIh2r0z8hCaeD0zvr77cEIJB8LwnNKfGuEcgdmH4BEbGbPFtx8NZVV0hiis2xH/Ruy/WH/R4k3SDbkKSKBQdB04t89/1O/w1cDnyilFU=",
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
      console.error(error.response.data.message);
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
            "Bearer Ww+VXPtfsqj1kn1WX2aOqM3KTJLJqvfudBt3qTQel/dSzNbnelibvBNvoF1jxXOuHjqfIh2r0z8hCaeD0zvr77cEIJB8LwnNKfGuEcgdmH4BEbGbPFtx8NZVV0hiis2xH/Ruy/WH/R4k3SDbkKSKBQdB04t89/1O/w1cDnyilFU=",
        },
      }
    );
  } catch (error) {
    return; // Handle the error as needed
    console.error(error);
  }
};
module.exports = {
  getProfileInGroupById,
  getCreadit,
  openRound,
  replyMessage,
  showResult,
};
