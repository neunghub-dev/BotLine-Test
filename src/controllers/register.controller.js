const usersService = require("../services/users.service");

const register = async (req, res) => {
  try {
    const { name, tel, id_line, uuid, partner_id, recommend } = req.body;
    if (!name || !tel || !id_line || !uuid) {
      return res.status(400).json({
        status: false,
        message: "Please fill in all fields",
      });
    } else {
      const checkUser = await usersService.checkuuid(uuid);
      if (checkUser) {
        return res.status(400).json({
          status: false,
          message: "Repeate User",
        });
      }
      const data = {
        name,
        tel,
        uuid_line: uuid,
        line_id: id_line,
        credit: 0,
        bonus: 0,
        partner_id: partner_id,
        recommend: recommend,
      };
      const createUser = await usersService.register(data);
      if (!createUser) {
        return res.status(400).json({
          status: false,
          message: "Please fill in all fields",
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "Register success",
        });
      }
    }
  } catch (error) {}
};

module.exports = {
  register,
};
