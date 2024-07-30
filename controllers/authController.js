// backend/controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

// Setup PostgreSQL connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "mydatabase",
  password: "123456",
  port: 5432,
});

// Login function
exports.login = async (req, res) => {
  const { email, password } = req.body;

  console.log("email", email, password);
  console.log("JWT_SECRET", process.env.JWT_SECRET);

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      status: "success",
      message: "User logged in successfully",
      token,
      tentUserUuid: user.tentuserid,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res
      .status(500)
      .json({ status: "failure", message: "Internal server error" });
  }
};

// Function to generate a unique alphanumeric ID
const generateTentUserId = (length = 6) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let tentUserId = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    tentUserId += characters[randomIndex];
  }
  return tentUserId;
};

// Function to check if the ID already exists
const checkUniqueIdExists = async (tentUserId) => {
  const result = await pool.query("SELECT * FROM users WHERE tentuserid = $1", [
    tentUserId,
  ]);
  return result.rows.length > 0;
};

// Register function
exports.register = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  try {
    // Check if the email already exists
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length > 0) {
      return res
        .status(400)
        .json({ status: "error", message: "Email already exists" });
    }

    let tentUserId;
    do {
      tentUserId = generateTentUserId();
    } while (await checkUniqueIdExists(tentUserId));

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    await pool.query(
      "INSERT INTO users (firstname, lastname, email, password, tentuserid) VALUES ($1, $2, $3, $4, $5)",
      [firstname, lastname, email, hashedPassword, tentUserId]
    );

    // Respond with success message
    res.status(201).json({
      status: "success",
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};
