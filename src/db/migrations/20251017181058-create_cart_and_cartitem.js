'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Carts', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      status: { type: Sequelize.ENUM('active','checked_out'), allowNull: false, defaultValue: 'active' },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });

    await queryInterface.addIndex('Carts', ['userId','status'], { name: 'carts_user_status_idx' });

    await queryInterface.createTable('CartItems', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      cartId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Carts', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      menuItemId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'MenuItems', key: 'id' }, onDelete: 'RESTRICT', onUpdate: 'CASCADE' },
      quantity: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
      unitPrice: { type: Sequelize.DECIMAL(10,2), allowNull: false },
      lineTotal: { type: Sequelize.DECIMAL(10,2), allowNull: false },
      removedIngredientIds: { type: Sequelize.JSONB, allowNull: true },
      addedIngredientIds: { type: Sequelize.JSONB, allowNull: true },
      notes: { type: Sequelize.TEXT, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });

    await queryInterface.addIndex('CartItems', ['cartId'], { name: 'cartitems_cart_idx' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('CartItems', 'cartitems_cart_idx');
    await queryInterface.dropTable('CartItems');
    await queryInterface.removeIndex('Carts', 'carts_user_status_idx');
    await queryInterface.dropTable('Carts');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Carts_status"');
  }
};
