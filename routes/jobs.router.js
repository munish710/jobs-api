const express = require("express");
const router = express.Router();

const {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobs.controller");

router.route("/").get(getAllJobs);
router
  .route("/:id")
  .post(createJob)
  .get(getJob)
  .patch(updateJob)
  .delete(deleteJob);

module.exports = router;
