// routes/gigs.js
const { Gig } = require("../db");
const express = require("express");

const router = express.Router();
const { verifyToken } = require("../middleware/verifyToken.js");

//gigs = jobs

// GET /api/gigs (Fetch all open gigs with search)
router.get("/", async (req, res) => {
  const q = req.query.search;
  const filters = { status: "open" };

  // Basic Regex search for title
  if (q) {
    filters.title = { $regex: q, $options: "i" };
  }

  try {
    const gigs = await Gig.find(filters).sort({ createdAt: -1 });
    res.status(200).json(gigs);
  } catch (err) {
    res.status(500).send(err);
  }
});

// POST /api/gigs (Create new job)
router.post("/", verifyToken, async (req, res) => {
  const newGig = new Gig({
    ...req.body,
    ownerId: req.userId, // From middleware
  });

  try {
    const savedGig = await newGig.save();
    res.status(201).json(savedGig);
  } catch (err) {
    res.status(500).send(err);
  }
});
module.exports = router;
