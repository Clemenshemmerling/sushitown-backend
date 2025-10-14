'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OrderItems', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      quantity: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
      unitPrice: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      subtotal: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      OrderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Orders', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      MenuItemId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'MenuItems', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });

    await queryInterface.addIndex('OrderItems', ['OrderId', 'createdAt']);
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('OrderItems', ['OrderId', 'createdAt']);
    await queryInterface.dropTable('OrderItems');
  }
};
