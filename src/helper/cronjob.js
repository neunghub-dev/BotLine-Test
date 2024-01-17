const roundService = require("../services/round.service");
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

module.exports = {
  clearRound,
};
