import {DataTypes} from 'sequelize';
import sequelize from '../config/db.js';

const OrderItem = sequelize.define('OrderItem', {
  quantity: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 1},
  unitPrice: {type: DataTypes.DECIMAL(10, 2), allowNull: false},
  subtotal: {type: DataTypes.DECIMAL(10, 2), allowNull: false}
});

export default OrderItem;
