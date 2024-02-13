const userService = require("../services/user.service");

const getAllUsers = (req, res) => {
  // *** ADD ***
  const allUsers = userService.getAllUsers();
  res.send("Get all Users");
};

const getOneUser = (req, res) => {
  // *** ADD ***
  const user = userService.getOneUser();
  res.send("Get an existing User");
};

const createNewUser = (req, res) => {
  // *** ADD ***
  const createdUser = userService.createNewUser();
  res.send("Create a new User");
};

const updateOneUser = (req, res) => {
  // *** ADD ***
  const updatedUser = userService.updateOneUser();
  res.send("Update an existing User");
};

const deleteOneUser = (req, res) => {
  // *** ADD ***
  userService.deleteOneUser();
  res.send("Delete an existing User");
};

module.exports = {
  getAllUsers,
  getOneUser,
  createNewUser,
  updateOneUser,
  deleteOneUser,
};