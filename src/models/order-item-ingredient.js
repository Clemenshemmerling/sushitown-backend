import {DataTypes} from 'sequelize';
import sequelize from '../config/db.js';

const OrderItemIngredient = sequelize.define('OrderItemIngredient', {
  action: {type: DataTypes.ENUM('add', 'remove'), allowNull: false},
  priceDelta: {type: DataTypes.DECIMAL(10, 2), defaultValue: 0}
});

export default OrderItemIngredient;
