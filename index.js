// backend/index.js
const dotenv = require("dotenv");

const envFilePath = {
  development: ".env.development.local",
  sit: ".env.sit.local",
  production: ".env.prod.local",
}[process.env.NODE_ENV || "development"];

dotenv.config({ path: envFilePath });
console.log("Environment Variables Loaded:", process.env.JWT_SECRET);
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/userRoutes");

const app = express();
const path = require("path");
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
