require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
//connectDB
const connectDB = require("./db/db.connect");

//routers
const authRouter = require("./routes/auth.router");
const jobsRouter = require("./routes/jobs.router");

// middlewares
const notFoundMiddleware = require("./middlewares/not-found.middleware");
const errorHandlerMiddleware = require("./middlewares/error-handler.middleware");
const authMiddleware = require("./middlewares/auth.middleware");

app.use(express.json());
// extra packages

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authMiddleware, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    app.listen(port, console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
