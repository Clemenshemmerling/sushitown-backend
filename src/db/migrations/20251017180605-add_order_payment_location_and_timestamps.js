'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = 'Orders';
    const columns = await queryInterface.describeTable(table);

    if (!columns.paymentStatus) {
      await queryInterface.addColumn(table, 'paymentStatus', {
        type: Sequelize.ENUM('pending','link_sent','paid','failed','refunded'),
        allowNull: false,
        defaultValue: 'pending'
      });
    }
    if (!columns.paymentProvider) {
      await queryInterface.addColumn(table, 'paymentProvider', { type: Sequelize.STRING(50), allowNull: true });
    }
    if (!columns.paymentLinkUrl) {
      await queryInterface.addColumn(table, 'paymentLinkUrl', { type: Sequelize.STRING(1000), allowNull: true });
    }
    if (!columns.paymentRef) {
      await queryInterface.addColumn(table, 'paymentRef', { type: Sequelize.STRING(100), allowNull: true });
    }
    if (!columns.deliveryLocationSnapshot) {
      await queryInterface.addColumn(table, 'deliveryLocationSnapshot', { type: Sequelize.JSONB, allowNull: true });
    }

    if (!columns.receivedAt) await queryInterface.addColumn(table, 'receivedAt', { type: Sequelize.DATE, allowNull: true });
    if (!columns.acceptedAt) await queryInterface.addColumn(table, 'acceptedAt', { type: Sequelize.DATE, allowNull: true });
    if (!columns.preparingAt) await queryInterface.addColumn(table, 'preparingAt', { type: Sequelize.DATE, allowNull: true });
    if (!columns.readyAt) await queryInterface.addColumn(table, 'readyAt', { type: Sequelize.DATE, allowNull: true });
    if (!columns.outForDeliveryAt) await queryInterface.addColumn(table, 'outForDeliveryAt', { type: Sequelize.DATE, allowNull: true });
    if (!columns.deliveredAt) await queryInterface.addColumn(table, 'deliveredAt', { type: Sequelize.DATE, allowNull: true });
    if (!columns.cancelledAt) await queryInterface.addColumn(table, 'cancelledAt', { type: Sequelize.DATE, allowNull: true });
    if (!columns.completedAt) await queryInterface.addColumn(table, 'completedAt', { type: Sequelize.DATE, allowNull: true });

    const indexes = await queryInterface.showIndex(table);
    const hasStatusIdx = indexes.some(i => i.name === 'orders_status_idx');
    if (!hasStatusIdx && columns.status) {
      await queryInterface.addIndex(table, ['status'], { name: 'orders_status_idx' });
    }
    const hasUserIdx = indexes.some(i => i.name === 'orders_user_created_idx');
    if (!hasUserIdx && columns.userId && columns.createdAt) {
      await queryInterface.addIndex(table, ['userId','createdAt'], { name: 'orders_user_created_idx' });
    }
  },

  async down(queryInterface, Sequelize) {
    const table = 'Orders';
    const indexes = await queryInterface.showIndex(table);
    if (indexes.some(i => i.name === 'orders_user_created_idx')) {
      await queryInterface.removeIndex(table, 'orders_user_created_idx');
    }
    if (indexes.some(i => i.name === 'orders_status_idx')) {
      await queryInterface.removeIndex(table, 'orders_status_idx');
    }

    const columns = await queryInterface.describeTable(table);
    const toRemove = [
      'completedAt','cancelledAt','deliveredAt','outForDeliveryAt','readyAt','preparingAt','acceptedAt','receivedAt',
      'deliveryLocationSnapshot','paymentRef','paymentLinkUrl','paymentProvider'
    ];
    for (const c of toRemove) {
      if (columns[c]) await queryInterface.removeColumn(table, c);
    }
    if (columns.paymentStatus) {
      await queryInterface.removeColumn(table, 'paymentStatus');
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Orders_paymentStatus"');
    }
  }
};
