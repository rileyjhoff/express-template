const request = require('supertest');
const app = require('../lib/app');
const sequelize = require('../lib/utils/sequelize.js');

function setupDb() {
  return sequelize.sync({ force: true });
}

function closeAll() {
  return sequelize.close();
}

afterAll(closeAll);

const mockUser = {
  email: 'test@example.com',
  password: '123456',
};

async function signUpUser(credentials = mockUser) {
  const agent = request.agent(app);
  const res = await agent.post('/api/v1/auth/signup').send(credentials);
  return { agent, user: res.body, res, credentials };
}

module.exports = {
  setupDb,
  signUpUser,
};
