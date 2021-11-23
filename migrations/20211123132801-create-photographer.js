"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      "Photographers",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        full_name: {
          type: Sequelize.STRING,
        },
        avatar_url: {
          type: Sequelize.STRING,
          unique: "actions_unique",
        },
        avatar_public_id: {
          type: Sequelize.STRING,
          unique: "actions_unique",
        },
        instagram: {
          type: Sequelize.STRING,
        },
        status: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP()"),
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal(
            "CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()"
          ),
        },
      },
      {
        uniqueKeys: {
          actions_unique: {
            fields: ["avatar_url", "avatar_public_id"],
          },
        },
      }
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Photographers");
  },
};
