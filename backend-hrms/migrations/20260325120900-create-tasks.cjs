'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tasks', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      assigned_to: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      assigned_by: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('pending','in_progress','completed'),
        defaultValue: 'pending'
      },
      priority: {
        type: Sequelize.ENUM('low','medium','high'),
        defaultValue: 'medium'
      },
      due_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('tasks', ['assigned_to'], { name: 'idx_tasks_employee' });
    await queryInterface.addIndex('tasks', ['assigned_by']);

    await queryInterface.addConstraint('tasks', {
      fields: ['assigned_to'],
      type: 'foreign key',
      name: 'tasks_ibfk_1',
      references: { table: 'employees', field: 'id' },
      onDelete: 'CASCADE'
    });

    await queryInterface.addConstraint('tasks', {
      fields: ['assigned_by'],
      type: 'foreign key',
      name: 'tasks_ibfk_2',
      references: { table: 'employees', field: 'id' },
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tasks');
  }
};