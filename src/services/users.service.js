const usersModel = require("../models/users.model");

const create = (userData) => {
  return usersModel.create(userData);
};

const getUsers = () => {
  return usersModel.getUsers();
};

const getUsersById = (id) => {
  return usersModel.getUsersById(id);
};

const updateUsersById = (id, userData) => {
  return usersModel.updateUsersById(id, userData);
};

const deleteUsersById = (id) => {
  return usersModel.deleteUsersById(id);
};

const usersService = {
  create,
  getUsers,
  getUsersById,
  updateUsersById,
  deleteUsersById,
};

module.exports = usersService;
