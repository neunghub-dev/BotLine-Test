// const UserAdmin = require("../models/users_admin.service");
const axios = require("axios");

const adduserAdmin = async (req, res) => {
  // const { uuid } = req.body;
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=2002688520&redirect_uri=https://testapi.nuenghub-soft.online/api/v1/user/invite&state=freshhero5678&scope=profile%20openid&nonce=09876xyz",
    headers: {},
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

module.exports = {
  adduserAdmin,
};
