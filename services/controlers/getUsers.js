const pool = require("../config/db");

const getUsers = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT id, name, avatar_url FROM users");
    return res.json({
      success: true,
      message: "Users fetched successfully",
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { getUsers };
