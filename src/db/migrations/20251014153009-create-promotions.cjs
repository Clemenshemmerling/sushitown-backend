'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Promotions', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      title: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT },
      discountType: { type: Sequelize.ENUM('percent', 'fixed'), allowNull: false },
      discountValue: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      activeFrom: { type: Sequelize.DATE },
      activeTo: { type: Sequelize.DATE },
      isActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Promotions');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Promotions_discountType";');
  }
};
