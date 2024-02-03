const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth");
const authService = require("../services/auth.service");

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const users = await authService.login(username);
    console.log(users);

    if (!users) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }
    if (!users.password) {
      return res.status(404).json({
        status: false,
        message: "Password not found",
      });
    }

    const passwordIsValid = bcrypt.compareSync(password, users.password);

    if (!passwordIsValid) {
      return res.status(404).json({
        status: false,
        message: "Invalid Password!",
      });
    }

    const access_token = jwt.sign(
      { id: users.id, role: users.role, partnerId: users.partner_id },
      authConfig.secret,
      {
        expiresIn: "30d", // 1 mount
      }
    );

    return res.status(200).json({
      status: true,
      message: "Login Success",
      data: {
        access_token: access_token,
        token_type: "Bearer",
        expires_in: 2592000,
        role: users.role,
        partnerId: users.partner_id,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

module.exports = {
  login,
};
