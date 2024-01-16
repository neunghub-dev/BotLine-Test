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
            url: "https://hook.nuenghub-soft.online/img/pic1234.jpeg",
            margin: "none",
            align: "center",
            gravity: "center",
            size: "full",
            aspectMode: "cover",
            // backgroundColor: "#31CFEF",
            position: "absolute",
            offsetTop: "0px",
            offsetBottom: "0px",
            offsetStart: "0px",
            offsetEnd: "0px",
          },
          {
            type: "text",
            text: data.name,
            color: "#ffffff",
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
            text: `คงเหลือ ${data.credit} บาท`,
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
            url: "https://hook.nuenghub-soft.online/img/w12.png",
            size: "full",
            aspectRatio: "20:13",
            aspectMode: "cover",
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
            text: `${data}`,
            align: "center",
            contents: [],
          },
        ],
      },
    },
  };
};

const showResult = (data, round) => {
  return {
    type: "flex",
    altText: "Flex Message",
    contents: {
      type: "bubble",
      header: {
        type: "box",
        layout: "vertical",
        flex: 0,
        contents: [
          {
            type: "text",
            text: `ตรวจสอบผลรอบที่ #${round}`,
            align: "center",
            gravity: "center",
            contents: [],
          },
        ],
      },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "lg",
        contents: [
          {
            type: "box",
            layout: "vertical",
            spacing: "sm",
            margin: "xs",
            backgroundColor: "#E3E2E2FF",
            cornerRadius: "10px",
            contents: [
              {
                type: "text",
                text: "ขาเจ้า ",
                weight: "bold",
                align: "center",
                gravity: "center",
                contents: [],
              },
              {
                type: "text",
                text: `${data[0].textNumber}`,
                weight: "bold",
                align: "center",
                gravity: "center",
                contents: [],
              },
            ],
          },
          {
            type: "box",
            layout: "horizontal",
            spacing: "md",
            contents: [
              {
                type: "box",
                layout: "vertical",
                backgroundColor: `${
                  data[1].status === "winner"
                    ? "#afa8f5"
                    : data[1].status === "loser"
                    ? "#f1c1ad"
                    : "#E3E2E2FF"
                }`,
                cornerRadius: "10px",
                contents: [
                  {
                    type: "text",
                    text: "ขา 1",
                    align: "center",
                    gravity: "center",
                    contents: [],
                  },
                  {
                    type: "text",
                    text: `${data[1].textNumber}`,
                    align: "center",
                    gravity: "center",
                    contents: [],
                  },
                ],
              },
              {
                type: "box",
                layout: "vertical",
                backgroundColor: `${
                  data[2].status === "winner"
                    ? "#afa8f5"
                    : data[2].status === "loser"
                    ? "#f1c1ad"
                    : "#E3E2E2FF"
                }`,
                cornerRadius: "10px",
                contents: [
                  {
                    type: "text",
                    text: "ขา 2",
                    align: "center",
                    gravity: "center",
                    contents: [],
                  },
                  {
                    type: "text",
                    text: `${data[2].textNumber}`,
                    align: "center",
                    gravity: "center",
                    contents: [],
                  },
                ],
              },
              {
                type: "box",
                layout: "vertical",
                backgroundColor: `${
                  data[3].status === "winner"
                    ? "#afa8f5"
                    : data[3].status === "loser"
                    ? "#f1c1ad"
                    : "#E3E2E2FF"
                }`,
                cornerRadius: "10px",
                contents: [
                  {
                    type: "text",
                    text: "ขา 3",
                    align: "center",
                    gravity: "center",
                    contents: [],
                  },
                  {
                    type: "text",
                    text: `${data[3].textNumber}`,
                    align: "center",
                    gravity: "center",
                    contents: [],
                  },
                ],
              },
            ],
          },
          {
            type: "box",
            layout: "horizontal",
            spacing: "md",
            contents: [
              {
                type: "box",
                layout: "vertical",
                backgroundColor: `${
                  data[4].status === "winner"
                    ? "#afa8f5"
                    : data[4].status === "loser"
                    ? "#f1c1ad"
                    : "#E3E2E2FF"
                }`,
                cornerRadius: "10px",
                contents: [
                  {
                    type: "text",
                    text: "ขา 4",
                    align: "center",
                    gravity: "center",
                    contents: [],
                  },
                  {
                    type: "text",
                    text: `${data[4].textNumber}`,
                    align: "center",
                    gravity: "center",
                    contents: [],
                  },
                ],
              },
              {
                type: "box",
                layout: "vertical",
                backgroundColor: `${
                  data[5].status === "winner"
                    ? "#afa8f5"
                    : data[5].status === "loser"
                    ? "#f1c1ad"
                    : "#E3E2E2FF"
                }`,
                cornerRadius: "10px",
                contents: [
                  {
                    type: "text",
                    text: "ขา 5",
                    align: "center",
                    gravity: "center",
                    contents: [],
                  },
                  {
                    type: "text",
                    text: `${data[5].textNumber}`,
                    align: "center",
                    gravity: "center",
                    contents: [],
                  },
                ],
              },
              {
                type: "box",
                layout: "vertical",
                backgroundColor: `${
                  data[6].status === "winner"
                    ? "#afa8f5"
                    : data[6].status === "loser"
                    ? "#f1c1ad"
                    : "#E3E2E2FF"
                }`,
                cornerRadius: "10px",
                contents: [
                  {
                    type: "text",
                    text: "ขา 6",
                    align: "center",
                    gravity: "center",
                    contents: [],
                  },
                  {
                    type: "text",
                    text: `${data[6].textNumber}`,
                    align: "center",
                    gravity: "center",
                    contents: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  };
  // contents: {
  //   type: "bubble",
  //   direction: "ltr",
  //   header: {
  //     type: "box",
  //     layout: "vertical",
  //     contents: [
  //       {
  //         type: "text",
  //         text: `ตรวจสอบผลรอบที่ #${round}`,
  //         align: "center",
  //         contents: [],
  //       },
  //     ],
  //   },
  //   body: {
  //     type: "box",
  //     layout: "vertical",
  //     offsetTop: "0px",
  //     height: "150px",
  //     contents: [
  //       {
  //         type: "text",
  //         text: `${data[0].nameTxt}`,
  //         align: "center",
  //         offsetTop: "0px",
  //         contents: [],
  //       },
  //       {
  //         type: "box",
  //         layout: "horizontal",
  //         offsetTop: "10px",
  //         contents: [
  //           {
  //             type: "text",
  //             text: `${data[1].nameTxt}`,
  //             align: "center",
  //             gravity: "center",
  //             contents: [],
  //           },
  //           {
  //             type: "text",
  //             text: `${data[2].nameTxt}`,
  //             align: "center",
  //             gravity: "center",
  //             contents: [],
  //           },
  //         ],
  //       },
  //       {
  //         type: "box",
  //         layout: "horizontal",
  //         offsetTop: "20px",
  //         contents: [
  //           {
  //             type: "text",
  //             text: `${data[3].nameTxt}`,
  //             align: "center",
  //             gravity: "center",
  //             contents: [],
  //           },
  //           {
  //             type: "text",
  //             text: `${data[4].nameTxt}`,
  //             align: "center",
  //             gravity: "center",
  //             contents: [],
  //           },
  //         ],
  //       },
  //       {
  //         type: "box",
  //         layout: "horizontal",
  //         offsetTop: "30px",
  //         contents: [
  //           {
  //             type: "text",
  //             text: `${data[5].nameTxt}`,
  //             align: "center",
  //             gravity: "center",
  //             contents: [],
  //           },
  //           {
  //             type: "text",
  //             text: `${data[6].nameTxt}`,
  //             align: "center",
  //             gravity: "center",
  //             contents: [],
  //           },
  //         ],
  //       },
  //     ],
  //   },
  // },
};
const showResult2 = (data) => {
  console.log(data);
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
            text: `ตรวจสอบผลรอบที่ #${"1"}`,
            align: "center",
            contents: [],
          },
        ],
      },
      body: {
        type: "box",
        layout: "vertical",
        offsetTop: "0px",
        height: "300px",
        contents: [...data],
      },
    },
  };
};

const showResult3 = (data) => {
  console.log(data);
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
            text: `สรุปยอดทั้งหมด #${"1"}`,
            align: "center",
            contents: [],
          },
        ],
      },
      body: {
        type: "box",
        layout: "vertical",
        offsetTop: "0px",
        height: "300px",
        contents: [data],
      },
    },
  };
};

const showResultAll = (data) => {
  return {
    type: "flex",
    altText: "Flex Message",
    contents: {
      type: "carousel",
      contents: [...data],
    },
  };
};
module.exports = {
  showResult,
  showResult2,
  showResult3,
  checkCredit,
  startRound,
  showResultAll,
};
