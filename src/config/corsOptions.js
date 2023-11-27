const whitelist = [
  "https://hook.nuenghub-soft.online",
  "https://be.nuenghub-soft.online",
  "https://nuenghub-soft.online",
  "https://fe.nuenghub-soft.online",
  "http://localhost:3008",
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
