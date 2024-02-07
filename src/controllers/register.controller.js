const usersService = require("../services/users.service");

const generateRandomString = (length) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
};
const generateUniqueString = async (length) => {
  let newString = generateRandomString(length);

  let checkRef = await usersService.checkRef(newString);

  while (checkRef !== null) {
    newString = generateRandomString(length);
    checkRef = await usersService.checkRef(newString);
  }

  return newString;
};

const register = async (req, res) => {
  try {
    let refCode = await generateUniqueString(6);

    const { name, tel, id_line, uuid, partner_id, ref } = req.body;
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
      const checkRef = await usersService.checkRef(ref);
      const data = {
        name,
        tel,
        uuid_line: uuid,
        line_id: id_line,
        credit: 0,
        bonus: 0,
        partner_id: partner_id,
        ref: refCode,
        invite_id: checkRef ? checkRef.id : null,
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
