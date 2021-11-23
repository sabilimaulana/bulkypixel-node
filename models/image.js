"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Image.belongsTo(models.Photographer, {
        as: "photographer",
        foreignKey: "photographer_id",
      });
    }
  }
  Image.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      url: DataTypes.STRING,
      public_id: DataTypes.STRING,
      photographer_id: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Image",
    }
  );
  return Image;
};
