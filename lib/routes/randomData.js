const { Router } = require('express');
const RandomData = require('../models/RandomData');
const authorizeRandomData = require('../middleware/authorizeRandomData');

module.exports = Router()
  .param('id', (req, res, next, id) => {
    req.id = id;
    next();
  })

  .post('/', async ({ body, user }, res, next) => {
    try {
      const item = await RandomData.insert({ ...body, user_id: user.id });
      res.json(item);
    } catch (e) {
      next(e);
    }
  })

  .get('/:id', authorizeRandomData, async ({ id }, res, next) => {
    try {
      const item = await RandomData.getById(id);
      res.json(item);
    } catch (e) {
      next(e);
    }
  })

  .get('/', async ({ user }, res, next) => {
    try {
      const items = await RandomData.getAll(user.id);
      res.json(items);
    } catch (e) {
      next(e);
    }
  })

  .put('/:id', authorizeRandomData, async ({ id, user, body }, res, next) => {
    try {
      const item = await RandomData.updateById(id, user.id, body);
      res.json(item);
    } catch (e) {
      next(e);
    }
  })

  .delete('/:id', authorizeRandomData, async ({ id }, res, next) => {
    try {
      const item = await RandomData.delete(id);
      res.json(item);
    } catch (e) {
      next(e);
    }
  });
