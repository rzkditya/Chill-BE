const contentsService = require("../services/contents.service");

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
        succes: false,
        message:
          "content_type, title, description, release_year, video_url, cover_img are required",
      });
    }

    const contentData = req.body;

    const contentId = await contentsService.create(contentData);
    contentData.contentId = contentId;

    return res.status(201).json({ succes: true, data: contentData });
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
    const contents = await contentsService.getContents();

    res.status(200).json({ data: contents, succes: false });
  } catch (err) {
    console.error("Error fethcing contents");
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
      succes: false,
    });
  }
};

const getContentsById = async (req, res) => {
  try {
    const { id } = req.params;
    const content = await contentsService.getContentsById(id);

    if (!content) {
      res.status(404).json({
        message: "Content not found",
        success: false,
      });
    }

    res.status(200).json({ data: content, succes: false });
  } catch (err) {
    console.error("Error fethcing contents");
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
      succes: false,
    });
  }
};

const updateContentsById = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await contentsService.updateContentsById(id, req.body);

    if (!updated) {
      res.status(404).json({
        message: "Content not found",
        success: false,
      });
    }

    res.status(200).json({ data: id, ...req.body, succes: true });
  } catch (err) {
    console.error("Error fethcing contents");
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
      succes: false,
    });
  }
};

const deleteContentsById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await contentsService.deleteContentsById(id);

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
