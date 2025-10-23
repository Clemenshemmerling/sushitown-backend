import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('customer', 'staff', 'admin', 'cook', 'courier'), allowNull: false, defaultValue: 'customer' },
  phone: { type: DataTypes.STRING(30) },
  addressLine1: { type: DataTypes.STRING(200) },
  addressLine2: { type: DataTypes.STRING(200) },
  city: { type: DataTypes.STRING(100) },
  lat: { type: DataTypes.DECIMAL(10, 7) },
  lng: { type: DataTypes.DECIMAL(10, 7) },
  locationAccuracy: { type: DataTypes.DECIMAL(6, 2) },
  locationUpdatedAt: { type: DataTypes.DATE }
});

export default User;
