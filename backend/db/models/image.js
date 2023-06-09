"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    getImageable(options) {
      if (!this.imageableType) return Promise.resolve(null);
      const mixinMethodName = `get${this.imageableType}`;
      return this[mixinMethodName](options);
    }

    static associate(models) {
      Image.belongsTo(models.Spot, {
        foreignKey: "imageableId",
        constraints: false,
      });

      Image.belongsTo(models.Review, {
        foreignKey: "imageableId",
        constraints: false,
      });
    }
  }
  Image.init(
    {
      imageableId: DataTypes.INTEGER,
      imageableType: DataTypes.ENUM("Spot", "Review"),
      url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isUrl: false,
        },
      },
      preview: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Image",
    }
  );
  return Image;
};
