const whitelist = [
  "https://testapi.nuenghub-soft.online",
  "https://testbe.nuenghub-soft.online",
  "https://testfe.nuenghub-soft.online",
  "https://fe.nuenghub-soft.online",
  "https://hook.nuenghub-soft.online",
  "https://be.nuenghub-soft.online",
  "https://nuenghub-soft.online",
  "https://fe.nuenghub-soft.online",
  "http://localhost:3008",
  "http://localhost:3009",
  "https://pd.pd789.co",
  "https://hookpd.pd789.co",
  "https://backpd.pd789.co",
  "http://pd.pd789.co",
  "http://hookpd.pd789.co",
  "http://backpd.pd789.co",
];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
