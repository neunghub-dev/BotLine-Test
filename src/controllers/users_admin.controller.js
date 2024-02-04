// const UserAdmin = require("../models/users_admin.service");
const partnerService = require("../services/partner.service");
const usersAdminService = require("../services/users_admin.service");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const adduserAdmin = async (req, res) => {
  const { refCode, code, state } = req.query;
  if (refCode !== undefined) {
    const partner = await partnerService.getPartnerByRefCode(refCode);
    res.redirect(
      `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${partner.client_id}&redirect_uri=https://testapi.nuenghub-soft.online/api/v1/user/invite&state=${partner.refCode}&scope=profile%20openid&nonce=09876xyz`
    );
  }
  if (code !== undefined) {
    const partner = await partnerService.getPartnerByRefCode(state);
    const axios = require("axios");
    const qs = require("qs");
    let data = qs.stringify({
      grant_type: "authorization_code",
      code: code,
      client_id: partner.client_id,
      redirect_uri: "https://testapi.nuenghub-soft.online/api/v1/user/invite",
      client_secret: partner.channel_secret,
    });

    try {
      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://api.line.me/oauth2/v2.1/token",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: data,
      };

      const response = await axios.request(config);
      const token = response.data.id_token;

      // Decode JWT
      const decoded = jwt.decode(token);
      const sub = decoded.sub;
      const user = await usersAdminService.checkUser(sub);
      console.log(user);

      if (!user) {
        const data = {
          uuid: sub,
          partner_id: partner.id,
        };

        const add = await usersAdminService.addUserAdmin(data);

        if (add) {
          res.sendStatus(200);
        }
      } else {
        res.sendStatus(400);
      }

      console.log(sub);
    } catch (error) {
      console.log(error);
    }
  }
  // const { uuid } = req.body;
  // let config = {
  //   method: "get",
  //   maxBodyLength: Infinity,
  //   url: "https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=2002688520&redirect_uri=https://testapi.nuenghub-soft.online/api/v1/user/invite&state=freshhero5678&scope=profile%20openid&nonce=09876xyz",
  //   headers: {},
  // };

  // axios
  //   .request(config)
  //   .then((response) => {
  //     console.log(JSON.stringify(response.data));
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
};

module.exports = {
  adduserAdmin,
};
