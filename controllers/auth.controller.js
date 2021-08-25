const User = require("../models/user.model");
const { BadRequestError } = require("../errors");
const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new BadRequestError("Please provide name,email and password.");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const tempUser = { email, name, password: hashedPassword };
  const user = await User.create({ ...tempUser });
  res.status(StatusCodes.CREATED).json(user);
};

const login = async (req, res) => {
  res.send("Login user");
};

module.exports = { register, login };
