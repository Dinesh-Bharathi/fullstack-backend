const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "mydatabase",
  password: "123456",
  port: 5432,
});

// Get user by ID
const getUserById = async (tentuserid) => {
  const result = await pool.query("SELECT * FROM users WHERE tentuserid = $1", [
    tentuserid,
  ]);
  return result.rows[0];
};

// Update user details
const updateUserDetails = async (
  tentuserid,
  { firstname, lastname, email, profileImagePath }
) => {
  const result = await pool.query(
    "UPDATE users SET firstname = $1, lastname = $2, email = $3, profile_image_path = $4 WHERE tentuserid = $5 RETURNING *",
    [firstname, lastname, email, profileImagePath, tentuserid]
  );
  return result.rows[0];
};

// Update user password
const updateUserPassword = async (tentuserid, hashedPassword) => {
  await pool.query("UPDATE users SET password = $1 WHERE tentuserid = $2", [
    hashedPassword,
    tentuserid,
  ]);
};

module.exports = {
  getUserById,
  updateUserDetails,
  updateUserPassword,
};
