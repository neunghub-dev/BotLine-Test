const axios = require("axios");

const openRound = async (data) => {
  const dataMsg = data;

  if (data.userId === "Uab6dc3240000f41c68d86744421b375d") {
    await replyMessage(dataMsg.replyToken, {
      type: "text",
      text: "เปิดรอบแล้วจ้าาา",
    });
  } else {
    await replyMessage(dataMsg.replyToken, {
      type: "text",
      text: "คุณไม่มีสิทธิ์เปิดรอบ",
    });
  }
};
const replyMessage = (replyToken, message) => {
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
      messages: [message],
    }),
  };

  axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
};
const getProfileInGroupById = async (groupId, userId) => {
  try {
    const response = await axios.get(
      `https://api.line.me/v2/bot/group/${groupId}/member/${userId}`,
      {
        headers: {
          Authorization:
            "Bearer Ww+VXPtfsqj1kn1WX2aOqM3KTJLJqvfudBt3qTQel/dSzNbnelibvBNvoF1jxXOuHjqfIh2r0z8hCaeD0zvr77cEIJB8LwnNKfGuEcgdmH4BEbGbPFtx8NZVV0hiis2xH/Ruy/WH/R4k3SDbkKSKBQdB04t89/1O/w1cDnyilFU=",
        },
      }
    );
    const json = JSON.stringify(response.data);
    return JSON.parse(json);
  } catch (error) {
    console.error(error);
    return null; // Handle the error as needed
  }
};
module.exports = {
  openRound,
};
