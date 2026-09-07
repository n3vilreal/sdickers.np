const express = require("express");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cors = require("cors");
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);
const { connectDatabase } = require("./database/database");
const authRoute = require("./routes/authRoute");
const productRoute = require("./routes/productRoute");
const orderRoute = require("./routes/orderRoute");
const cartRoute = require("./routes/cartRoute");
const userRoute = require("./routes/userRoute");
app.use("/api", authRoute);
app.use("/api", productRoute);
app.use("/api", orderRoute);
app.use("/api", cartRoute);
app.use("/api", userRoute);
app.get("/", (req, res) => {
  res.json({
    message: "Sdickers API is running...",
  });
});
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

module.exports = app;
