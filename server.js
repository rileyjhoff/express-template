/* eslint-disable no-console */
const http = require('node:http');
const sequelize = require('./lib/utils/sequelize.js');
const app = require('./lib/app');

const PORT = process.env.PORT || 7890;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log('🚀 Server running', server.address());
});

process.on('exit', () => {
  console.log('👋  Goodbye!');
  sequelize.close();
});
