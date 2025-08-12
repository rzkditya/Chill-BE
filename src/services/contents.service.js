const contentsModel = require("../models/contents.model");

const create = (contentData) => {
  return contentsModel.create(contentData);
};

const getContents = () => {
  return contentsModel.getContents();
};

const getContentsById = (id) => {
  return contentsModel.getContentsById(id);
};

const updateContentsById = (id, data) => {
  return contentsModel.updateContentsById(id, data);
};

const deleteContentsById = (id) => {
  return contentsModel.deleteContentsById(id);
};

const contentsService = {
  create,
  getContents,
  getContentsById,
  updateContentsById,
  deleteContentsById,
};

module.exports = contentsService;
