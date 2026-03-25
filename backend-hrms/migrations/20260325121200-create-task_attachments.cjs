'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('task_attachments', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      task_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      file_url: {
        type: Sequelize.STRING(500)
      },
      uploaded_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('task_attachments', ['task_id']);

    await queryInterface.addConstraint('task_attachments', {
      fields: ['task_id'],
      type: 'foreign key',
      name: 'task_attachments_ibfk_1',
      references: { table: 'tasks', field: 'id' },
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('task_attachments');
  }
};