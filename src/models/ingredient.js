import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Ingredient = sequelize.define('Ingredient', {
  name: {type: DataTypes.STRING, allowNull: false, unique: true},
  priceDelta: {type: DataTypes.DECIMAL(10, 2), defaultValue: 0},
  isAvailable: {type: DataTypes.BOOLEAN, defaultValue: true}
});

export default Ingredient;

