import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const MenuItem = sequelize.define('MenuItem', {
  name: {type: DataTypes.STRING, allowNull: false},
  description: {type: DataTypes.TEXT},
  basePrice: {type: DataTypes.DECIMAL(10, 2), allowNull: false},
  isActive: {type: DataTypes.BOOLEAN, defaultValue: true}
});

export default MenuItem;
