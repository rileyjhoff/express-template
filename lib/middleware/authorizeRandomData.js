const RandomData = require('../models/RandomData');

module.exports = async (req, res, next) => {
  try {
    const randomData = await RandomData.findByPk(req.params.id);
    if (!randomData || randomData.userId !== req.user.id) {
      throw new Error('You do not have access to view this page');
    }
    next();
  } catch (e) {
    e.status = 403;
    next(e);
  }
};
