// routes/bids.js
const { Gig, Bid } = require("../db");
const mongoose = require("mongoose");
const express = require("express");
const { verifyToken } = require("../middleware/verifyToken.js");

const router = express.Router();

// POST /api/bids (Submit a bid)
router.post("/", verifyToken, async (req, res) => {
  try {
    // Optional: Prevent owner from bidding on their own gig
    const gig = await Gig.findById(req.body.gigId);
    if (gig.ownerId.toString() === req.userId)
      return res.status(403).send("You cannot bid on your own gig.");

    const newBid = new Bid({
      ...req.body,
      freelancerId: req.userId,
    });
    const savedBid = await newBid.save();
    res.status(201).json(savedBid);
  } catch (err) {
    res.status(500).send(err);
  }
});

// GET /api/bids/:gigId (Get bids - Owner only)
router.get("/:gigId", verifyToken, async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.gigId);

    // Security Check: Only the owner sees the bids
    if (gig.ownerId.toString() !== req.userId)
      return res.status(403).send("Unauthorized");

    const bids = await Bid.find({ gigId: req.params.gigId }).populate(
      "freelancerId",
      "username email"
    );
    res.status(200).json(bids);
  } catch (err) {
    res.status(500).send(err);
  }
});

// PATCH /api/bids/:bidId/hire (The Atomic Logic)
router.patch("/:bidId/hire", verifyToken, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Find the Bid
    const bidToHire = await Bid.findById(req.params.bidId).session(session);
    if (!bidToHire) throw new Error("Bid not found");

    // 2. Verify Ownership of the Gig
    const gig = await Gig.findById(bidToHire.gigId).session(session);
    if (gig.ownerId.toString() !== req.userId) {
      throw new Error("You do not own this gig");
    }

    // 3. Check if already assigned
    if (gig.status === "assigned") {
      throw new Error("Gig is already assigned!");
    }

    // --- ATOMIC UPDATES ---

    // A. Mark this specific bid as 'hired'
    bidToHire.status = "hired";
    await bidToHire.save({ session });

    // B. Mark the Gig as 'assigned'
    gig.status = "assigned";
    await gig.save({ session });

    // C. Mark ALL other bids for this gig as 'rejected'
    await Bid.updateMany(
      { gigId: gig._id, _id: { $ne: bidToHire._id } }, // Match gig, exclude hired bid
      { $set: { status: "rejected" } }
    ).session(session);

    // Commit the transaction
    await session.commitTransaction();
    res.status(200).json({ message: "Freelancer hired successfully!" });
  } catch (err) {
    // If anything fails, roll back everything
    await session.abortTransaction();
    res.status(400).send(err.message);
  } finally {
    session.endSession();
  }
});
module.exports = router;
