import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Order = sequelize.define('Order', {
  status: { type: DataTypes.ENUM('pending','accepted','preparing','ready','out_for_delivery','completed','cancelled'), defaultValue: 'pending' },
  total: { type: DataTypes.DECIMAL(10,2), defaultValue: 0 },
  address: { type: DataTypes.STRING },
  notes: { type: DataTypes.TEXT }
});

export default Order;
