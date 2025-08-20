const Content = require("../models/contents.model");
const { Op } = require("sequelize");

const create = async (req, res) => {
  try {
    const {
      content_type,
      title,
      description,
      release_year,
      video_url,
      cover_img,
    } = req.body;

    if (
      !content_type ||
      !title ||
      !description ||
      !release_year ||
      !video_url ||
      !cover_img
    ) {
      return res.status(400).json({
        success: false,
        message: "Required field cannot be empty",
      });
    }

    const contentData = await Content.create({
      content_type,
      title,
      description,
      release_year,
      video_url,
      cover_img,
    });

    return res.status(201).json({
      success: true,
      message: "Succesfully add content",
      data: contentData,
    });
  } catch (err) {
    console.error("Error creating user: ", err);
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Content already exist" });
    }
    res
      .status(500)
      .json({ message: "Internal Server Error", err: err.message });
  }
};

const getContents = async (req, res) => {
  try {
    const {
      sortBy,
      order = "ASC",
      search,
      page: queryPage,
      limit: queryLimit,
      ...filter
    } = req.query;
    let limit = parseInt(queryLimit) || 5;
    let offset = (queryPage - 1) * limit;

    const queryOptions = {
      where: {},
      limit,
      offset,
    };

    // Filter
    if (Object.keys(filter).length > 0) {
      queryOptions.where = { ...filter };
    }

    // Search
    if (search) {
      queryOptions.where[Op.or] = [
        { title: { [Op.like]: `${search}%` } },
        { description: { [Op.like]: `${search}%` } },
      ];
    }

    // Sort
    if (sortBy) {
      queryOptions.order = [[sortBy, order.toUpperCase()]];
    }

    const contents = await Content.findAll(queryOptions);

    if (contents.length === 0) {
      return res.status(404).json({
        data: contents,
        success: false,
        message: "No content found",
      });
    }

    res.status(200).json({ data: contents, success: true });
  } catch (err) {
    console.error("Error fethcing contents");
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
      success: false,
    });
  }
};

const getContentsById = async (req, res) => {
  try {
    const { id } = req.params;
    const content = await Content.findByPk(id);

    if (!content) {
      res.status(404).json({
        message: "Content not found",
        success: false,
      });
    }

    res.status(200).json({ data: content, success: true });
  } catch (err) {
    console.error("Error fethcing contents");
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
      success: false,
    });
  }
};

const updateContentsById = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Required field cannot be empty",
      });
    }

    const [updateRows] = await User.update(updateData, {
      where: {
        content_id: id,
      },
    });

    if (updateRows === 0) {
      return res.status(404).json({
        message: "Content not found",
        success: false,
      });
    }

    res.status(200).json({ data: id, ...req.body, success: true });
  } catch (err) {
    console.error("Error fethcing contents");
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
      success: false,
    });
  }
};

const deleteContentsById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Content.destroy({
      where: {
        content_id: id,
      },
    });

    if (!deleted) {
      res.status(404).json({
        message: "Content not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Content successfully deleted",
      success: true,
    });
  } catch (err) {
    console.error("Error delelting content");
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
      success: false,
    });
  }
};

const contentsController = {
  create,
  getContents,
  getContentsById,
  updateContentsById,
  deleteContentsById,
};

module.exports = contentsController;
