'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('task_comments', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      task_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('task_comments', ['task_id']);
    await queryInterface.addIndex('task_comments', ['employee_id']);

    await queryInterface.addConstraint('task_comments', {
      fields: ['task_id'],
      type: 'foreign key',
      name: 'task_comments_ibfk_1',
      references: { table: 'tasks', field: 'id' },
      onDelete: 'CASCADE'
    });

    await queryInterface.addConstraint('task_comments', {
      fields: ['employee_id'],
      type: 'foreign key',
      name: 'task_comments_ibfk_2',
      references: { table: 'employees', field: 'id' },
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('task_comments');
  }
};