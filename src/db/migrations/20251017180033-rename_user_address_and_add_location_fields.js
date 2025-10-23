'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = 'Users';

    const columns = await queryInterface.describeTable(table);
    if (columns.address && !columns.addressLine1) {
      await queryInterface.renameColumn(table, 'address', 'addressLine1');
    }

    if (!columns.phone) await queryInterface.addColumn(table, 'phone', { type: Sequelize.STRING(30), allowNull: true });
    if (!columns.addressLine2) await queryInterface.addColumn(table, 'addressLine2', { type: Sequelize.STRING(200), allowNull: true });
    if (!columns.city) await queryInterface.addColumn(table, 'city', { type: Sequelize.STRING(100), allowNull: true });
    if (!columns.lat) await queryInterface.addColumn(table, 'lat', { type: Sequelize.DECIMAL(10, 7), allowNull: true });
    if (!columns.lng) await queryInterface.addColumn(table, 'lng', { type: Sequelize.DECIMAL(10, 7), allowNull: true });
    if (!columns.locationAccuracy) await queryInterface.addColumn(table, 'locationAccuracy', { type: Sequelize.DECIMAL(6, 2), allowNull: true });
    if (!columns.locationUpdatedAt) await queryInterface.addColumn(table, 'locationUpdatedAt', { type: Sequelize.DATE, allowNull: true });

    await queryInterface.sequelize.query(`ALTER TYPE "enum_Users_role" ADD VALUE IF NOT EXISTS 'cook'`);
    await queryInterface.sequelize.query(`ALTER TYPE "enum_Users_role" ADD VALUE IF NOT EXISTS 'courier'`);
    await queryInterface.changeColumn(table, 'role', {
      type: Sequelize.ENUM('customer', 'staff', 'admin', 'cook', 'courier'),
      allowNull: false,
      defaultValue: 'customer'
    });

    const indexes = await queryInterface.showIndex(table);
    const hasPhoneIdx = indexes.some(i => i.name === 'users_phone_idx');
    if (!hasPhoneIdx) await queryInterface.addIndex(table, ['phone'], { name: 'users_phone_idx' });
  },

  async down(queryInterface, Sequelize) {
    const table = 'Users';

    const indexes = await queryInterface.showIndex(table);
    const hasPhoneIdx = indexes.some(i => i.name === 'users_phone_idx');
    if (hasPhoneIdx) await queryInterface.removeIndex(table, 'users_phone_idx');

    const columns = await queryInterface.describeTable(table);
    if (columns.locationUpdatedAt) await queryInterface.removeColumn(table, 'locationUpdatedAt');
    if (columns.locationAccuracy) await queryInterface.removeColumn(table, 'locationAccuracy');
    if (columns.lng) await queryInterface.removeColumn(table, 'lng');
    if (columns.lat) await queryInterface.removeColumn(table, 'lat');
    if (columns.city) await queryInterface.removeColumn(table, 'city');
    if (columns.addressLine2) await queryInterface.removeColumn(table, 'addressLine2');
    if (columns.phone) await queryInterface.removeColumn(table, 'phone');

    if (columns.addressLine1) {
      const colsAgain = await queryInterface.describeTable(table);
      if (colsAgain.addressLine1) {
        await queryInterface.renameColumn(table, 'addressLine1', 'address');
      }
    }

    await queryInterface.sequelize.query(`ALTER TABLE "Users" ALTER COLUMN "role" SET DEFAULT 'customer'`);
  }
};
