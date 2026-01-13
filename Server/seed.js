// server/seed.js

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

// --- ADJUST THESE PATHS TO MATCH YOUR PROJECT STRUCTURE ---
// Example: If your models are in server/models/User.js
const { User, Gig, Bid } = require("./db");

// ----------------------------------------------------------

dotenv.config();

const seedData = async () => {
  try {
    // 1. Connect to DB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // 2. Clear existing data (Optional: Remove if you want to keep old data)
    await User.deleteMany({});
    await Gig.deleteMany({});
    await Bid.deleteMany({});
    console.log("Cleared existing Users, Gigs, and Bids.");

    // 3. Create Users (Password: "123456")
    const hashedPassword = await bcrypt.hash("123456", 10);

    const client = await User.create({
      username: "Client_Boss",
      email: "client@test.com",
      password: hashedPassword,
    });

    const freelancer1 = await User.create({
      username: "Dev_Jane",
      email: "jane@test.com",
      password: hashedPassword,
    });

    const freelancer2 = await User.create({
      username: "Designer_Bob",
      email: "bob@test.com",
      password: hashedPassword,
    });

    console.log("Created 3 Users: Client_Boss, Dev_Jane, Designer_Bob");

    // 4. Create Gigs (Posted by Client_Boss)
    const gig1 = await Gig.create({
      ownerId: client._id,
      title: "Build a Complete E-commerce Website",
      description:
        "I need a full-stack developer to build a shopify-like store using MERN stack. Must be responsive and secure.",
      budget: 1500,
      status: "open",
    });

    const gig2 = await Gig.create({
      ownerId: client._id,
      title: "Modern Logo Design for Tech Startup",
      description:
        "Looking for a clean, minimalist logo for my AI company. Colors: Blue and White.",
      budget: 200,
      status: "open",
    });

    const gig3 = await Gig.create({
      ownerId: client._id,
      title: "SEO Optimization for Blog",
      description:
        "Need to rank my travel blog on the first page of Google. Long term contract available.",
      budget: 500,
      status: "open",
    });

    console.log("Created 3 Gigs posted by Client_Boss");

    // 5. Create Bids
    // Jane bids on the Website Gig
    await Bid.create({
      gigId: gig1._id,
      freelancerId: freelancer1._id,
      price: 1400,
      message:
        "I have built 5 e-commerce sites before. I can finish this in 2 weeks.",
      status: "pending",
    });

    // Bob bids on the Website Gig (Competition!)
    await Bid.create({
      gigId: gig1._id,
      freelancerId: freelancer2._id,
      price: 1200,
      message:
        "I am a new developer but very passionate. I will do it cheaper.",
      status: "pending",
    });

    // Bob bids on the Logo Gig
    await Bid.create({
      gigId: gig2._id,
      freelancerId: freelancer2._id,
      price: 150,
      message: "I am an expert in minimalist vector art. Check my portfolio.",
      status: "pending",
    });

    console.log("Created Bids: Jane & Bob applied to gigs.");

    console.log("Database Seeded Successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
};

seedData();
