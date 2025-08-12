const db = require("../configs/db");

// create table contents (
// 	content_id int primary key auto_increment,
// 	content_type varchar(50),
// 	title varchar(255),
// 	description varchar(255),
// 	release_year year,
// 	video_url varchar(255),
// 	cover_img varchar(255)
// );

const create = async (contentData) => {
  const {
    content_type,
    title,
    description,
    release_year,
    video_url,
    cover_img,
  } = contentData;

  const [result] = await db.execute(
    `
      INSERT INTO
        contents(content_type, title, description, release_year, video_url, cover_img)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    [content_type, title, description, release_year, video_url, cover_img]
  );

  return result.insertId;
};

const getContents = async () => {
  const [rows] = await db.execute(
    `SELECT
      content_type, title, description, release_year, video_url, cover_img 
    FROM contents`
  );

  return rows;
};

const getContentsById = async (id) => {
  const [rows] = await db.execute(
    `SELECT 
      content_type, title, description, release_year, video_url, cover_img 
    FROM contents 
    WHERE content_id = ?`,
    [id]
  );

  return rows[0];
};

const updateContentsById = async (id, data) => {
  const {
    content_type,
    title,
    description,
    release_year,
    video_url,
    cover_img,
  } = data;

  const [result] = await db.execute(
    `
      UPDATE contents
      SET content_type = ?, title = ?, description = ?, release_year = ?, video_url = ?, cover_img = ?
      WHERE content_id = ?
    `,
    [content_type, title, description, release_year, video_url, cover_img, id]
  );

  return result.affectedRows > 0;
};

const deleteContentsById = async (id) => {
  const [result] = await db.execute(
    `
      DELETE
      FROM contents 
      WHERE content_id = ?
    `,
    [id]
  );

  return result.affectedRows > 0;
};

const contentsModel = {
  create,
  getContents,
  getContentsById,
  updateContentsById,
  deleteContentsById,
};

module.exports = contentsModel;
