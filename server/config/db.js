const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelizeConfig = {
  dialect: 'mysql',
  logging: false,
};

if (process.env.DB_SOCKET_PATH) {
  sequelizeConfig.dialectOptions = {
    socketPath: process.env.DB_SOCKET_PATH,
  };
}

const dbUrl = process.env.DB_URL || process.env.MYSQL_URL;
const sequelize = new Sequelize(dbUrl, sequelizeConfig);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL Database connected successfully.');
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
};

module.exports = { sequelize, connectDB };
