require("dotenv").config();

const express = require("express");

const cors = require("cors");
const mainRouter = require("./routes/index.js");
const cookieParser = require("cookie-parser");
const app = express();

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

app.listen(3000, () => {
  console.log("Listening on 3000 port");
});
