const checkCredit = (data) => {
  return {
    type: "flex",
    altText: "คุณได้รับข้อความ",
    contents: {
      type: "bubble",
      direction: "ltr",
      header: {
        type: "box",
        layout: "vertical",
        flex: 1,
        spacing: "none",
        margin: "none",
        position: "relative",
        contents: [
          {
            type: "image",
            url: "https://developers.line.biz/assets/images/services/bot-designer-icon.png",
            margin: "none",
            align: "center",
            gravity: "center",
            size: "full",
            aspectMode: "cover",
            backgroundColor: "#31CFEF",
            position: "absolute",
            offsetTop: "0px",
            offsetBottom: "0px",
            offsetStart: "0px",
            offsetEnd: "0px",
          },
          {
            type: "text",
            text: data.name,
            weight: "regular",
            flex: 1,
            align: "center",
            gravity: "center",
            style: "normal",
            position: "relative",
            contents: [],
          },
        ],
      },
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: `${data.credit} บาท`,
            align: "center",
            contents: [],
          },
        ],
      },
    },
  };
};

const startRound = (data) => {
  return {
    type: "flex",
    altText: "คุณได้รับข้อความ",
    contents: {
      type: "bubble",
      direction: "ltr",
      header: {
        type: "box",
        layout: "vertical",
        flex: 1,
        spacing: "none",
        margin: "none",
        position: "relative",
        contents: [
          {
            type: "image",
            url: "https://developers.line.biz/assets/images/services/bot-designer-icon.png",
            margin: "none",
            align: "center",
            gravity: "center",
            size: "full",
            aspectMode: "cover",
            backgroundColor: "#31CFEF",
            position: "absolute",
            offsetTop: "0px",
            offsetBottom: "0px",
            offsetStart: "0px",
            offsetEnd: "0px",
          },
          //   {
          //     type: "text",
          //     text: data.name,
          //     weight: "regular",
          //     flex: 1,
          //     align: "center",
          //     gravity: "center",
          //     style: "normal",
          //     position: "relative",
          //     contents: [],
          //   },
        ],
      },
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: `รอบที่ ${data}`,
            align: "center",
            contents: [],
          },
        ],
      },
    },
  };
};

const showResult = (data) => {
  return {
    type: "flex",
    altText: "Flex Message",
    contents: {
      type: "bubble",
      direction: "ltr",
      header: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "ตรวจสอบผลรอบที่ #123123",
            align: "center",
            contents: [],
          },
        ],
      },
      body: {
        type: "box",
        layout: "vertical",
        offsetTop: "0px",
        height: "150px",
        contents: [
          {
            type: "text",
            text: `${data[0].nameTxt}`,
            align: "center",
            offsetTop: "0px",
            contents: [],
          },
          {
            type: "box",
            layout: "horizontal",
            offsetTop: "10px",
            contents: [
              {
                type: "text",
                text: `${data[1].nameTxt}`,
                align: "center",
                gravity: "center",
                contents: [],
              },
              {
                type: "text",
                text: `${data[2].nameTxt}`,
                align: "center",
                gravity: "center",
                contents: [],
              },
            ],
          },
          {
            type: "box",
            layout: "horizontal",
            offsetTop: "20px",
            contents: [
              {
                type: "text",
                text: `${data[3].nameTxt}`,
                align: "center",
                gravity: "center",
                contents: [],
              },
              {
                type: "text",
                text: `${data[4].nameTxt}`,
                align: "center",
                gravity: "center",
                contents: [],
              },
            ],
          },
          {
            type: "box",
            layout: "horizontal",
            offsetTop: "30px",
            contents: [
              {
                type: "text",
                text: `${data[5].nameTxt}`,
                align: "center",
                gravity: "center",
                contents: [],
              },
              {
                type: "text",
                text: `${data[6].nameTxt}`,
                align: "center",
                gravity: "center",
                contents: [],
              },
            ],
          },
        ],
      },
    },
  };
};
module.exports = {
  showResult,
  checkCredit,
  startRound,
};
