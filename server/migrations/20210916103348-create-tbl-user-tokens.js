export function up(queryInterface, Sequelize) {
  return queryInterface.createTable('user_tokens', {
    user_id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.BIGINT,
      references: {
        model: {
          tableName: 'users'
        },
        key: 'id',
        onDelete: 'CASCADE'
      }
    },
    access_token: {
      type: Sequelize.STRING
    },
    refresh_token: {
      type: Sequelize.STRING
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  })
}
export function down(queryInterface, Sequelize) {
  return queryInterface.dropTable('user_tokens');
}
