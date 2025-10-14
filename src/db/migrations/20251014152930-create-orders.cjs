'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      status: { type: Sequelize.ENUM('pending','accepted','preparing','ready','out_for_delivery','completed','cancelled'), allowNull: false, defaultValue: 'pending' },
      total: { type: Sequelize.DECIMAL(10,2), allowNull: false, defaultValue: 0 },
      address: { type: Sequelize.STRING },
      notes: { type: Sequelize.TEXT },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE'
      },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    }, {
      indexes: [
        { fields: ['UserId', 'createdAt'] }
      ]
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Orders');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Orders_status";');
  }
};
