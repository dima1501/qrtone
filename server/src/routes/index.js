const express = require("express");
const router = express.Router();
const clientPromise = require("../db/db");
const config = require("../config/config");
const compression = require("compression");

router.use(compression());

router.use(async (req, res, next) => {
  try {
    const client = await clientPromise;
    req.db = client.db(config.DB_NAME);
    next();
  } catch (error) {
    console.error(error);
  }
});

router.use("/", require("./MainRoutes"));
router.use("/", require("./AuthRoutes"));
router.use("/", require("./LkRoutes"));
router.use("/", require("./UploadRoutes"));
router.use("/", require("./GuestRoutes"));

module.exports = router;
