'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('wfh_requests', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      manager_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      hr_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      end_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      reason: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.ENUM('pending','managerApproved','approved','rejected'),
        defaultValue: 'pending'
      },
      manager_approval: {
        type: Sequelize.ENUM('pending','approved','rejected'),
        defaultValue: 'pending'
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('wfh_requests', ['employee_id']);

    await queryInterface.addConstraint('wfh_requests', {
      fields: ['employee_id'],
      type: 'foreign key',
      name: 'wfh_requests_ibfk_1',
      references: { table: 'employees', field: 'id' },
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('wfh_requests');
  }
};