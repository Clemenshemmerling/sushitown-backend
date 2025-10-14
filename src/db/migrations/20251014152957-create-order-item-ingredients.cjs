'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OrderItemIngredients', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      action: { type: Sequelize.ENUM('add', 'remove'), allowNull: false },
      priceDelta: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      OrderItemId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'OrderItems', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      IngredientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Ingredients', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('OrderItemIngredients');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_OrderItemIngredients_action";');
  }
};
