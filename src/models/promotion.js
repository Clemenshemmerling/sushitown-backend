import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Promotion = sequelize.define('Promotion', {
  title: {type: DataTypes.STRING, allowNull: false},
  description: {type: DataTypes.TEXT},
  discountType: {type: DataTypes.ENUM('percent', 'fixed'), allowNull: false},
  discountValue: {type: DataTypes.DECIMAL(10, 2), allowNull: false},
  activeFrom: {type: DataTypes.DATE},
  activeTo: {type: DataTypes.DATE},
  isActive: {type: DataTypes.BOOLEAN, defaultValue: true}
});

export default Promotion;

