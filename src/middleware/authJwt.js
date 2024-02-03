const jwt = require("jsonwebtoken");
const authconfig = require("../config/auth");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // let token = req.session.token
  if (!token) {
    return res.status(403).json({
      status: false,
      message: "No token provided!",
    });
  }

  jwt.verify(token, authconfig.secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized!",
      });
    }
    req.userId = decoded.id;
    req.role = decoded.role;
    req.token = token;
    req.partnerId = decoded.partnerId;
    next();
  });
};

module.exports = {
  verifyToken,
};
