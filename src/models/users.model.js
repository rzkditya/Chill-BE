const db = require("../configs/db");

// create table users (
// 	user_id int primary key auto_increment,
// 	username varchar(50) not null unique,
// 	email varchar(255),
// 	password varchar(255) not null,
// 	created_at timestamp default CURRENT_TIMESTAMP()
// );

const create = async (userData) => {
  const { username, email, password, created_at } = userData;

  const [result] = await db.execute(
    `
        INSERT INTO
            users(username, email, password, created_at)
        VALUES (?, ?, ?, ?)
    `,
    [username, email, password, created_at]
  );

  return result.insertId;
};

const getUsers = async () => {
  const [rows] = await db.execute(
    `
      SELECT
        username, email, password, created_at
      FROM users
    `
  );

  return rows;
};

const getUsersById = async (id) => {
  const [rows] = await db.execute(
    `
      SELECT
        username, email, password, created_at
      FROM users
      WHERE user_id = ?
    `,
    [id]
  );

  return rows[0];
};

const updateUsersById = async (id, userData) => {
  const { username, email, password } = userData;

  const [result] = await db.execute(
    `
      UPDATE users
      SET username = ?, email = ?, password = ?
      WHERE user_id = ?
    `,
    [username, email, password, id]
  );

  return result.affectedRows > 0;
};

const deleteUsersById = async (id) => {
  const [result] = await db.execute(
    `
      DELETE
      FROM users
      WHERE user_id = ?
    `,
    [id]
  );

  return result.affectedRows > 0;
};

const usersModel = {
  create,
  getUsers,
  getUsersById,
  updateUsersById,
  deleteUsersById,
};

module.exports = usersModel;
