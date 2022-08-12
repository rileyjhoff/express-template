/* eslint-disable no-console */
const { Sequelize } = require('sequelize');

const options = { dialect: 'postgres', logging: false };

let sequelize = null;

const { DATABASE_URL } = process.env;
if (DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, options);
} else {
  const {
    PGDATABASE: database,
    PGUSER: username,
    PGPASSWORD: password,
  } = process.env;
  sequelize = new Sequelize({ ...options, database, username, password });
}

(async () => {
  try {
    await sequelize.authenticate();
    console.log(
      '🐘 Sequelize Postgres connected to',
      sequelize.getDatabaseName()
    );
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = sequelize;
