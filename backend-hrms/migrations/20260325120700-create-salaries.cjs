'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('salaries', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      month: {
        type: Sequelize.STRING(20)
      },
      year: {
        type: Sequelize.INTEGER
      },
      basic_salary: {
        type: Sequelize.DECIMAL(10,2)
      },
      allowance: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0.00
      },
      bonus: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0.00
      },
      working_days: {
        type: Sequelize.INTEGER
      },
      present_days: {
        type: Sequelize.INTEGER
      },
      leave_days: {
        type: Sequelize.INTEGER
      },
      per_day_salary: {
        type: Sequelize.DECIMAL(10,2)
      },
      deduction: {
        type: Sequelize.DECIMAL(10,2)
      },
      final_salary: {
        type: Sequelize.DECIMAL(10,2)
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      status: {
        type: Sequelize.ENUM('Pending','Generated','Paid'),
        defaultValue: 'Generated'
      }
    });

    await queryInterface.addIndex('salaries', ['employee_id']);

    await queryInterface.addConstraint('salaries', {
      fields: ['employee_id'],
      type: 'foreign key',
      name: 'salaries_ibfk_1',
      references: { table: 'employees', field: 'id' },
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('salaries');
  }
};