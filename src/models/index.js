"use strict";
require("dotenv").config({ path: `.env.${process.env.ENV_NAME}` });
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
// const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "production";
//import config
const config = require(__dirname + "/../config/config.js")[env];
// const config = require(__dirname + '/../config/config.js')[env];
const db = {};
let sequelize;
console.log(require(__dirname + "/../config/config.js"));
console.log(env);
console.log(config);
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  (sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  )),
    {
      dialectOptions: {
        useUTC: true, //for reading from database
      },
      timezone: "+07:00", //for writing to database
    };
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
