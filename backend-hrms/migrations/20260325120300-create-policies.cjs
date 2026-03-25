'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('policies', {
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
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      max_leaves_per_year: {
        type: Sequelize.INTEGER,
        defaultValue: 20
      },
      max_wfh_per_month: {
        type: Sequelize.INTEGER,
        defaultValue: 8
      },
      late_mark_time: {
        type: Sequelize.TIME,
        defaultValue: '09:30:00'
      },
      half_day_cutoff: {
        type: Sequelize.TIME,
        defaultValue: '13:00:00'
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('policies');
  }
};