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
  "https://pdk.pd789.co",
  "https://hookpdk.pd789.co",
  "https://backpdk.pd789.co",
  "http://pdk.pd789.co",
  "http://hookpdk.pd789.co",
  "http://backpdk.pd789.co",
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
