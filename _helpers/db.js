const config = require("config.json");
const mysql = require("mysql2/promise");
const sequelize = require("sequelize");
const { Sequelize } = require("sequelize");

module.exports = db = {};

initialize();

async function initialize() {
  // create db
  const { host, port, user, password, database } = config.database;
  const connection = await mysql.createConnection({
    host,
    port,
    user,
    password,
  });
  // await connection.query(`CREATE DATABASE IF NOT EXIST \`${database} \`;`);
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

  //connect db

  const sequelize = new Sequelize(database, user, password, {
    dialect: "mysql",
  });

  //init model and add them to the exported db project

  db.User = require("../users/user-model")(sequelize);

  await sequelize.sync({ alter: true });
}
