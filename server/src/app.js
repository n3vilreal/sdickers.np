const express = require("express");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cors = require("cors");
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);
const isPreviewOrigin = (origin) =>
  /^https:\/\/sdickers-(?!vercel\.app)[a-z0-9-]+-nebil-khanals-projects\.vercel\.app$/.test(
    origin,
  );
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || isPreviewOrigin(origin)) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
const { connectDatabase } = require("./database/database");
const authRoute = require("./routes/authRoute");
const productRoute = require("./routes/productRoute");
const orderRoute = require("./routes/orderRoute");
const cartRoute = require("./routes/cartRoute");
const userRoute = require("./routes/userRoute");
const packRoute = require("./routes/packRoute");
const reviewRoute = require("./routes/reviewRoute");
app.use("/api", authRoute);
app.use("/api", productRoute);
app.use("/api", orderRoute);
app.use("/api", cartRoute);
app.use("/api", userRoute);
app.use("/api", packRoute);
app.use("/api", reviewRoute);
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
