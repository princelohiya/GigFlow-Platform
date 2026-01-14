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

const allowedOrigins = [
  "http://localhost:5173",
  "https://gigflowpl.vercel.app",
];

// 1. Socket.io: Allow All Origins
const io = new Server(server, {
  cors: {
    // This function accepts ANY origin
    origin: (origin, callback) => {
      callback(null, true);
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cookieParser());
app.use(express.json());

// 2. Express: Allow All Origins
app.use(
  cors({
    origin: true, // 'true' means "reflect the request origin" (allows everyone)
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
