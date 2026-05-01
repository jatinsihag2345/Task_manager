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

const sequelize = new Sequelize(process.env.DB_URL, sequelizeConfig);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL Database connected successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
