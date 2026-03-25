'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('employees', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true
      },
      position: {
        type: Sequelize.STRING(100)
      },
      hire_date: {
        type: Sequelize.DATEONLY
      },
      leave_balance: {
        type: Sequelize.INTEGER,
        defaultValue: 20
      },
      basic_salary: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0.00
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      department_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      phone: {
        type: Sequelize.STRING(20)
      },
      join_date: {
        type: Sequelize.DATEONLY
      },
      manager_id: {
        type: Sequelize.INTEGER
      },
      hr_id: {
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        unique: true
      },
      profile_image: {
        type: Sequelize.STRING(255)
      }
    });

    await queryInterface.addConstraint('employees', {
      fields: ['department_id'],
      type: 'foreign key',
      name: 'fk_department',
      references: {
        table: 'departments',
        field: 'id'
      },
      onDelete: 'SET NULL'
    });

    await queryInterface.addConstraint('employees', {
      fields: ['manager_id'],
      type: 'foreign key',
      name: 'fk_emp_manager',
      references: {
        table: 'employees',
        field: 'id'
      },
      onDelete: 'SET NULL'
    });

    await queryInterface.addConstraint('employees', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_emp_user',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('employees');
  }
};