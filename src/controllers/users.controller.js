const User = require("../models/users.model");

const create = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "username, email, password are required",
      });
    }

    const newUser = await User.create({
      username,
      email,
      password,
    });

    return res.status(201).json({ success: true, data: newUser });
  } catch (err) {
    console.error("Error creating user: ", err);
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "Username already exist" });
    }
    res
      .status(500)
      .json({ message: "Internal Server Error", err: err.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();

    res.status(200).json({ data: users, success: true });
  } catch (err) {
    console.error("Error fethcing users");
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
      success: false,
    });
  }
};

const getUsersById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    res.status(200).json({ data: user, success: true });
  } catch (err) {
    console.error("Error fethcing user");
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
      success: false,
    });
  }
};

const updateUsersById = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "username, email, password, created_at are required",
      });
    }

    const [updateRows] = await User.update(updateData, {
      where: {
        user_id: id,
      },
    });

    if (updateRows === 0) {
      return res.status(404).json({
        message: "user not found",
        success: false,
      });
    }

    res.status(200).json({ data: id, ...req.body, success: true });
  } catch (err) {
    console.error("Error fethcing users");
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
      success: false,
    });
  }
};

const deleteUsersById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.destroy({
      where: {
        user_id: id,
      },
    });

    if (!deleted) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "User successfully deleted",
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
