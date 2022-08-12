const { Model, DataTypes } = require('sequelize');
const User = require('./User.js');
const sequelize = require('../utils/sequelize');

class RandomData extends Model {
  static findAllForUser(userId) {
    return this.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });
  }

  static findOneOfUser(id, userId) {
    return this.findOne({
      where: { id, userId },
    });
  }

  static createForUser(randomData, userId) {
    return this.create({ ...randomData, userId });
  }

  static async updateForUser(id, randomData, userId) {
    const [, [updated]] = await this.update(
      { ...randomData, userId },
      { where: { id, userId }, returning: true }
    );

    return updated;
  }

  static destroyForUser(id, userId) {
    return this.destroy({
      where: { id, userId },
      returning: true,
    });
  }
}

RandomData.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    age: {
      type: DataTypes.INTEGER,
      validate: {
        min: {
          args: [18],
          msg: 'Quantity (age) cannot be less than 18',
        },
      },
    },
  },
  { sequelize, modelName: 'random_data' }
);

User.hasMany(RandomData);
RandomData.belongsTo(User);

module.exports = RandomData;
