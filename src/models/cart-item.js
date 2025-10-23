import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const CartItem = sequelize.define('CartItem', {
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  unitPrice: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  lineTotal: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  removedIngredientIds: { type: DataTypes.JSONB },
  addedIngredientIds: { type: DataTypes.JSONB },
  notes: { type: DataTypes.TEXT }
});

export default CartItem;
