import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Cart = sequelize.define('Cart', {
  status: { type: DataTypes.ENUM('active','checked_out'), allowNull: false, defaultValue: 'active' }
});

export default Cart;
