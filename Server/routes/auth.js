// routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../db");
const router = express.Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).send("User created");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send("User not found");

    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid) return res.status(400).send("Wrong credentials");

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET
    );

    // Send HttpOnly Cookie
    // FIX: Send the _id along with other details
    const { password, ...otherDetails } = user._doc; // user._doc extracts the clean data object

    res
      .cookie("accessToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .status(200)
      .json(otherDetails); // This sends { _id, username, email, ... }
  } catch (err) {
    res.status(500).send(err);
  }
});

// routes/auth.js
router.post("/logout", (req, res) => {
  res
    .clearCookie("accessToken", {
      sameSite: "strict",
      secure: false, // Set to true in production
    })
    .status(200)
    .send("User has been logged out.");
});

module.exports = router;
