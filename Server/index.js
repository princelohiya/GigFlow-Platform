require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mainRouter = require("./routes/index.js");
const cookieParser = require("cookie-parser");
// 1. IMPORT HTTP AND SOCKET.IO
const http = require("http");
const { Server } = require("socket.io");
const { default: mongoose } = require("mongoose");

const app = express();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};
// 2. CREATE HTTP SERVER
// We wrap the express app so we can reuse the server for sockets
const server = http.createServer(app);

// 3. CONFIGURE SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Your frontend URL
    methods: ["GET", "POST"],
  },
});

app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.use("/", mainRouter);

// ---------------------------------------------------------
// 4. SOCKET.IO LOGIC (The "Post Office")
// ---------------------------------------------------------
let onlineUsers = []; // Stores { userId, socketId }

const addUser = (userId, socketId) => {
  // Prevent duplicates
  if (!onlineUsers.some((user) => user.userId === userId)) {
    onlineUsers.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  // A. When a user logs in (Frontend sends 'addUser')
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    console.log("User connected. Total Online:", onlineUsers.length);
  });

  // B. Send Notification
  // Triggered when the Client clicks "Hire"
  socket.on("sendNotification", ({ receiverId, message }) => {
    const receiver = getUser(receiverId);
    if (receiver) {
      io.to(receiver.socketId).emit("getNotification", {
        message,
      });
    }
  });

  // C. Disconnect
  socket.on("disconnect", () => {
    removeUser(socket.id);
    console.log("User disconnected!");
  });
});
// ---------------------------------------------------------

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  connect();
  console.log(`Backend server (HTTP + Socket) running on port ${PORT}`);
});
