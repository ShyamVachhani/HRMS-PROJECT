'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('announcements', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      content: {
        type: Sequelize.TEXT
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      policy_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      audience: {
        type: Sequelize.ENUM('all','hr','manager','employee'),
        defaultValue: 'all'
      }
    });

    await queryInterface.addIndex('announcements', ['created_by']);
    await queryInterface.addConstraint('announcements', {
      fields: ['created_by'],
      type: 'foreign key',
      name: 'announcements_ibfk_1',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('announcements');
  }
};