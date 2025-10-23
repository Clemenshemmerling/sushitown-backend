import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Order = sequelize.define('Order', {
  status: { type: DataTypes.ENUM('pending','accepted','preparing','ready','out_for_delivery','completed','cancelled'), defaultValue: 'pending' },
  total: { type: DataTypes.DECIMAL(10,2), defaultValue: 0 },
  address: { type: DataTypes.STRING },
  notes: { type: DataTypes.TEXT },
  paymentStatus: { type: DataTypes.ENUM('pending','link_sent','paid','failed','refunded'), defaultValue: 'pending' },
  paymentProvider: { type: DataTypes.STRING(50) },
  paymentLinkUrl: { type: DataTypes.STRING(1000) },
  paymentRef: { type: DataTypes.STRING(100) },
  deliveryLocationSnapshot: { type: DataTypes.JSONB },
  receivedAt: { type: DataTypes.DATE },
  acceptedAt: { type: DataTypes.DATE },
  preparingAt: { type: DataTypes.DATE },
  readyAt: { type: DataTypes.DATE },
  outForDeliveryAt: { type: DataTypes.DATE },
  deliveredAt: { type: DataTypes.DATE },
  cancelledAt: { type: DataTypes.DATE },
  completedAt: { type: DataTypes.DATE }
});

export default Order;
