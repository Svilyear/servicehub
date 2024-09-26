const { DataTypes } = require('sequelize');
const sequelize = require('./database'); 
const User = sequelize.define('User', {
   id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
 
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});
module.exports = User;