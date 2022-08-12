const { verifyToken } = require('../utils/jwtToken.js');

module.exports = async (req, res, next) => {
  try {
    req.user = verifyToken(req);
    next();
  } catch (err) {
    err.status = 401;
    next(err);
  }
};
