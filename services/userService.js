const { Pool } = require("pg");

// Use DATABASE_URL environment variable for connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Enable SSL for Render
  },
});

// Get user by ID
const getUserById = async (tentuserid) => {
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE tentuserid = $1",
      [tentuserid]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error getting user by ID:", error);
    throw error;
  }
};

// Update user details
const updateUserDetails = async (
  tentuserid,
  { firstname, lastname, email, profileImagePath }
) => {
  try {
    const result = await pool.query(
      "UPDATE users SET firstname = $1, lastname = $2, email = $3, profile_image_path = $4 WHERE tentuserid = $5 RETURNING *",
      [firstname, lastname, email, profileImagePath, tentuserid]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error updating user details:", error);
    throw error;
  }
};

// Update user password
const updateUserPassword = async (tentuserid, hashedPassword) => {
  try {
    await pool.query("UPDATE users SET password = $1 WHERE tentuserid = $2", [
      hashedPassword,
      tentuserid,
    ]);
  } catch (error) {
    console.error("Error updating user password:", error);
    throw error;
  }
};

module.exports = {
  getUserById,
  updateUserDetails,
  updateUserPassword,
};
