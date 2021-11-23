"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Photographer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Photographer.hasMany(models.Image, {
        as: "image",
        foreignKey: "photographer_id",
      });
    }
  }
  Photographer.init(
    {
      full_name: DataTypes.STRING,
      avatar_url: DataTypes.STRING,
      avatar_public_id: DataTypes.STRING,
      instagram: DataTypes.STRING,
      slug: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Photographer",
    }
  );
  return Photographer;
};
