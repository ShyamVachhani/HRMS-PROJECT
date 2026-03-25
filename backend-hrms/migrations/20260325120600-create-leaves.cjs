'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('leaves', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      leave_type: {
        type: Sequelize.STRING(50),
        allowNull: false
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
        type: Sequelize.ENUM('pending','managerApproved','approved','Rejected'),
        defaultValue: 'pending'
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      manager_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      hr_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate : Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('leaves', ['employee_id']);
    await queryInterface.addIndex('leaves', ['manager_id']);
    await queryInterface.addIndex('leaves', ['hr_id']);

    await queryInterface.addConstraint('leaves', {
      fields: ['employee_id'],
      type: 'foreign key',
      name: 'leaves_ibfk_1',
      references: { table: 'employees', field: 'id' },
      onDelete: 'CASCADE'
    });

    await queryInterface.addConstraint('leaves', {
      fields: ['manager_id'],
      type: 'foreign key',
      name: 'fk_manager',
      references: { table: 'employees', field: 'id' },
      onDelete: 'SET NULL'
    });

    await queryInterface.addConstraint('leaves', {
      fields: ['hr_id'],
      type: 'foreign key',
      name: 'fk_hr',
      references: { table: 'employees', field: 'id' },
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('leaves');
  }
};