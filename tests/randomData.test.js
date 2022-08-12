const request = require('supertest');
const { setupDb, signUpUser } = require('./utils.js');
const app = require('../lib/app');

describe('/api/v1/random-data', () => {
  beforeEach(setupDb);

  it('POST / creates a new piece of random data with the current user', async () => {
    const { agent, user } = await signUpUser();

    const newRandomData = { name: 'buddy', age: 23 };
    const { status, body } = await agent
      .post('/api/v1/random-data')
      .send(newRandomData);

    expect(status).toEqual(200);
    expect(body).toEqual({
      ...newRandomData,
      id: expect.any(Number),
      userId: user.id,
      active: false,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('GET / returns all random data associated with the authenticated User', async () => {
    // create a user
    const { agent } = await signUpUser();
    const { body: user1RandomData } = await agent
      .post('/api/v1/random-data')
      .send({
        name: 'hunter',
        age: 26,
      });

    const { agent: agent2 } = await signUpUser({
      email: 'user2@email.com',
      password: 'password',
    });

    const { body: user2RandomData } = await agent2
      .post('/api/v1/random-data')
      .send({
        name: 'james',
        age: 26,
      });

    const resp1 = await agent.get('/api/v1/random-data');
    expect(resp1.status).toEqual(200);
    expect(resp1.body).toEqual([user1RandomData]);

    const resp2 = await agent2.get('/api/v1/random-data');
    expect(resp2.status).toEqual(200);
    expect(resp2.body).toEqual([user2RandomData]);
  });

  it('GET /:id should get a piece of random data', async () => {
    const { agent } = await signUpUser();

    const { body: randomData } = await agent.post('/api/v1/random-data').send({
      name: 'hunter',
      age: 26,
    });

    const { status, body: got } = await agent.get(
      `/api/v1/random-data/${randomData.id}`
    );

    expect(status).toBe(200);
    expect(got).toEqual(randomData);
  });

  it('GET / should return a 401 if not authenticated', async () => {
    const { status } = await request(app).get('/api/v1/random-data');
    expect(status).toEqual(401);
  });

  it('UPDATE /:id should update a piece of random data', async () => {
    const { agent } = await signUpUser();

    const { body: randomData } = await agent.post('/api/v1/random-data').send({
      name: 'hunter',
      age: 26,
    });

    const { status, body: updated } = await agent
      .put(`/api/v1/random-data/${randomData.id}`)
      .send({ active: true });

    expect(status).toBe(200);
    expect(updated).toEqual({
      ...randomData,
      updatedAt: expect.any(String),
      active: true,
    });
  });

  it('UPDATE /:id should 403 for invalid users', async () => {
    const { agent } = await signUpUser();

    const { body: randomData } = await agent.post('/api/v1/random-data').send({
      name: 'hunter',
      age: 26,
    });

    const { agent: agent2 } = await signUpUser({
      email: 'user2@email.com',
      password: 'password',
    });

    const { status, body } = await agent2
      .put(`/api/v1/random-data/${randomData.id}`)
      .send({ active: true });

    expect(status).toBe(403);
    expect(body).toEqual({
      status: 403,
      message: 'You do not have access to view this page',
    });
  });

  it('DELETE /:id should delete random data for valid user', async () => {
    const { agent } = await signUpUser();

    const { body: randomData } = await agent.post('/api/v1/random-data').send({
      name: 'hunter',
      age: 26,
    });

    const { status, body } = await agent.delete(
      `/api/v1/random-data/${randomData.id}`
    );
    expect(status).toBe(200);
    expect(body).toEqual({ deleted: true });

    const { body: deleteReturn } = await agent.get('/api/v1/random-data');

    expect(deleteReturn.length).toBe(0);
  });
});
