'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MenuItemIngredients', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      MenuItemId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'MenuItems', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      IngredientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Ingredients', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('MenuItemIngredients');
  }
};
