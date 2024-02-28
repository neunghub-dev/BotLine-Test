const roundService = require("../services/round.service");
const transactionService = require("../services/transaction.service");
const cron = require("node-cron");
const clearRound = () => {
  cron.schedule(
    "0 6 * * *",
    async () => {
      const groupAllId = await roundService.getAllGroupIdLine();
      const json = JSON.stringify(groupAllId);
      const data = JSON.parse(json);
      const round = {
        round: 0,
        type: "success",
        isOpen: true,
        isClose: true,
        openRoundAt: new Date(),
        groupId: "",
      };

      for (const item of data) {
        round.groupId = item.groupId;
        await roundService.createRound(round);
      }
      console.log("Clear Round");

      const getAllRound = await roundService.DeleteRoundDetailDateBefore();
      if (getAllRound) {
        console.log("Clear All Round Success");
      }
    },
    {
      scheduled: true,
      timezone: "Asia/Bangkok",
    }
  );
};

const updateIsSelectRound = () => {
  cron.schedule(
    "0 6 * * *",
    async () => {
      console.log("Update IsSelect");
      const allTransaction = await transactionService.getAllTransaction();
      const json = JSON.stringify(allTransaction);
      const data = JSON.parse(json);
      if (data.length === 0) {
        console.log("No Data");
        return;
      }
      const id = [];
      for (let item of data) {
        id.push(item.id);
      }
      const res = await transactionService.updateIsSelect(id);
      if (res) {
        console.log("Update IsSelect Success");
      }
    },
    {
      scheduled: true,
      timezone: "Asia/Bangkok",
    }
  );
};

module.exports = {
  updateIsSelectRound,
  clearRound,
};
