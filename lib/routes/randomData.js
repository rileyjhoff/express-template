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
      const randomData = await RandomData.createForUser(body, user.id);
      res.json(randomData);
    } catch (e) {
      next(e);
    }
  })

  .get('/:id', authorizeRandomData, async ({ id, user }, res, next) => {
    try {
      const randomData = await RandomData.findOneOfUser(id, user.id);
      res.json(randomData);
    } catch (e) {
      next(e);
    }
  })

  .get('/', async ({ user }, res, next) => {
    try {
      const randomData = await RandomData.findAllForUser(user.id);
      res.json(randomData);
    } catch (e) {
      next(e);
    }
  })

  .put('/:id', authorizeRandomData, async ({ id, user, body }, res, next) => {
    try {
      const randomData = await RandomData.updateForUser(id, body, user.id);
      res.json(randomData);
    } catch (e) {
      next(e);
    }
  })

  .delete('/:id', authorizeRandomData, async ({ id, user }, res, next) => {
    try {
      const count = await RandomData.destroyForUser(id, user.id);
      res.json({ deleted: !!count });
    } catch (e) {
      next(e);
    }
  });
