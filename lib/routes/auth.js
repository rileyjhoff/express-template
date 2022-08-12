const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const { setToken, clearToken } = require('../utils/jwtToken.js');
const User = require('../models/User');
const HttpError = require('../utils/httpError.js');

function sendResponse(res, user) {
  // eslint-disable-next-line no-unused-vars
  const { password, passwordHash, ...rest } = user.toJSON();
  const { id, email } = rest;
  setToken(res, { id, email });
  res.json(rest);
}

module.exports = Router()
  .get('/verify', authenticate, (req, res) => {
    res.json(req.user);
  })
  .post('/signup', async ({ body }, res, next) => {
    try {
      const user = await User.create(body);
      sendResponse(res, user);
    } catch (error) {
      next(error);
    }
  })
  .post('/signin', async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      let isValid = false;
      if (user) {
        isValid = await user.comparePassword(password);
      }
      if (!isValid) {
        throw new HttpError('Invalid credentials', 400);
      }
      sendResponse(res, user);
    } catch (error) {
      next(error);
    }
  })
  .delete('/signout', (req, res) => {
    clearToken(res);
    res.json({ success: true });
  });
