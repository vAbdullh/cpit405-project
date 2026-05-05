const UserModel = require("../models/userModel");

/**
 * @desc   Get all users
 * @route  GET /v1/api/users
 */
const getUsers = (req, res) => {
  const users = UserModel.findAll();
  res.json({ count: users.length, data: users });
};

/**
 * @desc   Get user by ID
 * @route  GET /v1/api/users/:id
 */
const getUserById = (req, res) => {
  const user = UserModel.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json({ data: user });
};

/**
 * @desc   Create a new user
 * @route  POST /v1/api/users
 */
const createUser = (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res
      .status(400)
      .json({ message: "Name and email are required" });
  }

  const user = UserModel.create({ name, email });
  res.status(201).json({ data: user });
};

/**
 * @desc   Update a user
 * @route  PUT /v1/api/users/:id
 */
const updateUser = (req, res) => {
  const user = UserModel.update(req.params.id, req.body);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json({ data: user });
};

/**
 * @desc   Delete a user
 * @route  DELETE /v1/api/users/:id
 */
const deleteUser = (req, res) => {
  const deleted = UserModel.delete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json({ message: "User deleted" });
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };
