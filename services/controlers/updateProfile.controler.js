const cloudinary = require("../config/cloudinary");
const pool = require("../config/db");
const bcrypt = require("bcrypt");
const salt = 10;
const updateImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  try {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "avatar" },
      async (error, result) => {
        if (error) {
          console.error("Error uploading image to Cloudinary:", error);
          return res.status(500).json({ error: "Failed to upload image." });
        }

        const avatarUrl = result.secure_url;
        const userId = req.userId;

        await pool.query("UPDATE users SET avatar_url = $1 WHERE id = $2", [
          avatarUrl,
          userId,
        ]);

        res.json({
          success: true,
          message: "Avatar updated!",
          avatarUrl: avatarUrl,
        });
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (error) {
    // --- الكود المعدل ---
    console.error("Error in updateProfile controller:", error); // 👈 اطبع الخطأ
    res.status(500).json({ error: "Internal server error." });
  }
};
const updateProfile = async (req, res) => {
  const { name, email, password } = req.body;
  const userId = req.userId;
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    const query =
      "UPDATE users SET name = $1, email = $2, password_hash = $3 WHERE id = $4";
    const values = [name, email, hashedPassword, userId];
    await pool.query(query, values);
    res.json({
      success: true,
      message: "Profile updated!",
      data: {
        name,
        email,
        userId,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
const getProfile = async (req, res) => {
  const userId = req.userId;
  try {
    const query = "SELECT * FROM users WHERE id = $1";
    const values = [userId];
    const result = await pool.query(query, values);
    res.json({
      success: true,
      message: "Profile retrieved!",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error getting profile:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
module.exports = {
  updateImage,
  updateProfile,
  getProfile,
};
