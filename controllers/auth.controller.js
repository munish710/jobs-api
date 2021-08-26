const User = require("../models/user.model");
const { BadRequestError, UnauthorizedError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthorizedError("Invalid credentials");
  }
  //compare password
  const isPasswordCorrect = await user.comparePassword();
  if (!isPasswordCorrect) {
    throw new UnauthorizedError("Invalid credentials");
  }
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ token, user: { name: user.name } });
};

module.exports = { register, login };
