require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const mainRouter = require("./routes/index.js");

const app = express();
const server = http.createServer(app);

// --- 1. DATABASE ---
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

// --- 2. ALLOWED ORIGINS (Hardcoded) ---
// We explicitly list your Vercel App here.
const allowedOrigins = [
  "http://localhost:5173",
  "https://gigflowpl.vercel.app",
];

// --- 3. SOCKET.IO CONFIG ---
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cookieParser());
app.use(express.json());

// --- 4. EXPRESS CORS CONFIG ---
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.use("/", mainRouter);

// Socket Logic
io.on("connection", (socket) => {
  // ... (Keep your existing socket logic here)
  console.log("User connected:", socket.id);
});

// --- 5. START SERVER ---
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  connect();
  console.log(`Server running on port ${PORT}`);
});
