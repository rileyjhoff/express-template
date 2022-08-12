const { Model, DataTypes } = require('sequelize');
const sequelize = require('../utils/sequelize');
const bcrypt = require('bcrypt');

class User extends Model {
  async comparePassword(password) {
    return await bcrypt.compare(password, this.passwordHash);
  }
}

User.init(
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Not a valid email',
        },
      },
      unique: {
        msg: 'Email already exists',
      },
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.VIRTUAL,
      validate: {
        len: {
          args: [6],
          msg: 'Password must be at least 6 characters',
        },
      },
      get() {
        return this.setDataValue('passwordHash');
      },
      set(password) {
        const passwordHash = bcrypt.hashSync(
          password,
          Number(process.env.SALT_ROUNDS)
        );
        this.setDataValue('password', password);
        this.setDataValue('passwordHash', passwordHash);
      },
    },
  },
  { sequelize, modelName: 'user' }
);

module.exports = User;
