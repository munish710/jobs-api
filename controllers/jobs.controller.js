const Job = require("../models/job.model");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userID }).sort("createdAt");
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
  const {
    user: { userID },
    params: { id: jobID },
  } = req;
  const job = await Job.find({ createdBy: userID, _id: jobID });
  if (!job) {
    throw new NotFoundError(`No job with id ${jobID}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userID;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
  res.json(req.user);
};

const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userID },
    params: { id: jobID },
  } = req;

  if (!company || !position) {
    throw new BadRequestError("Company or Position Fields cannot be empty");
  }

  const updatedJob = await Job.findOneAndUpdate(
    { _id: jobID, createdBy: userID },
    req.body,
    { new: true, runValidators: true }
  );

  if (!updatedJob) {
    throw new NotFoundError(`No job with id ${jobID}`);
  }

  res.status(StatusCodes.OK).json({ job: updatedJob });
};

const deleteJob = async (req, res) => {
  const {
    user: { userID },
    params: { id: jobID },
  } = req;

  const deletedJob = await Job.findByIdAndRemove({
    _id: jobID,
    createdBy: userID,
  });
  if (!deletedJob) {
    throw new NotFoundError(`No job with id ${jobID}`);
  }

  res.status(StatusCodes.OK).send();
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
