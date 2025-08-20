const { DataTypes } = require("sequelize");

const sequelize = require("../configs/db");

// create table contents (
// 	content_id int primary key auto_increment,
// 	content_type varchar(50),
// 	title varchar(255),
// 	description varchar(255),
// 	release_year year,
// 	video_url varchar(255),
// 	cover_img varchar(255)
// );

const Content = sequelize.define(
  "Content",
  {
    content_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
    },
    description: {
      type: DataTypes.STRING(255),
    },
    release_year: {
      type: DataTypes.INTEGER,
    },
    video_url: {
      type: DataTypes.STRING(255),
    },
    cover_img: {
      type: DataTypes.STRING(255),
    },
  },
  {
    tableName: "contents",
    timestamps: false,
  }
);

module.exports = Content;
