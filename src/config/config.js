require("dotenv").config({ path: `.env.${process.env.ENV_NAME}` });
console.log(process.env.ENV_NAME);
module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    timezone: "+07:00",
    dialect: "mysql",
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    timezone: "+07:00",
    dialect: "mysql",
  },
};
