const express = require("express");

const authRouter = require("./auth.js");
const bidsRouter = require("./bids.js");
const gigsRouter = require("./gigs.js");

const router = express.Router();

router.use("/api/auth", authRouter);
router.use("/api/bids", bidsRouter);
router.use("/api/gigs", gigsRouter);

module.exports = router;
