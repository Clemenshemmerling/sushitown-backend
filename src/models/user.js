import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const User = sequelize.define('User', {
  name: {type: DataTypes.STRING, allowNull: false},
  email: {type: DataTypes.STRING, allowNull: false, unique: true},
  passwordHash: {type: DataTypes.STRING, allowNull: false},
  role: {type: DataTypes.ENUM('customer', 'staff', 'admin'), defaultValue: 'customer'},
  phone: {type: DataTypes.STRING},
  address: {type: DataTypes.STRING}
});

export default User;
