const usersService = require("../services/users.service");

const create = async (req, res) => {
  try {
    const { username, email, password, created_at } = req.body;

    if (!username || !email || !password || !created_at) {
      return res.status(400).json({
        succes: false,
        message: "username, email, password, created_at are required",
      });
    }

    const userData = req.body;

    const userId = await usersService.create(userData);
    userData.usersId = userId;

    return res.status(201).json({ succes: true, data: userData });
  } catch (err) {
    console.error("Error creating user: ", err);
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Username already exist" });
    }
    res
      .status(500)
      .json({ message: "Internal Server Error", err: err.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await usersService.getUsers();

    res.status(200).json({ data: users, succes: false });
  } catch (err) {
    console.error("Error fethcing users");
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
      succes: false,
    });
  }
};

const getUsersById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await usersService.getUsersById(id);

    if (!user) {
      res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    res.status(200).json({ data: user, succes: false });
  } catch (err) {
    console.error("Error fethcing user");
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
      succes: false,
    });
  }
};

const updateUsersById = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await usersService.updateUsersById(id, req.body);

    if (!updated) {
      res.status(404).json({
        message: "user not found",
        success: false,
      });
    }

    res.status(200).json({ data: id, ...req.body, succes: true });
  } catch (err) {
    console.error("Error fethcing users");
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
      succes: false,
    });
  }
};

const deleteUsersById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await usersService.deleteUsersById(id);

    if (!deleted) {
      res.status(404).json({
        message: "user not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "user successfully deleted",
      success: true,
    });
  } catch (err) {
    console.error("Error delelting user");
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
      success: false,
    });
  }
};

const usersController = {
  create,
  getUsers,
  getUsersById,
  updateUsersById,
  deleteUsersById,
};

module.exports = usersController;
