// const mongoose = require('mongoose');

// const ProductSchema = new mongoose.Schema({
//   productName: { type: String, required: true },
//   productDescription: { type: String, required: true },
//   productPrice: { type: Number, required: true },
//   productImage: { type: String, required: true },
//   sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
// });

// module.exports = mongoose.model('product', ProductSchema);

const { DataTypes } = require('sequelize');
const sequelize = require('./database');
const User = require('./User');  // Correctly import the User model

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productDescription: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  productImage: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sellerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,  // Reference the User model
      key: 'id',    // Name of the referenced column in the User model
    },
  },
  
});
Product.belongsTo(User, { foreignKey: 'sellerId' });

module.exports = Product;

