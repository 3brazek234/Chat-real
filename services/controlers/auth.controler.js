const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const checkUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );  
    if (checkUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists.",
        data: null,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]
    );

    const user = newUser.rows[0];
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully!",
      data: {
        token,
        user: { id: user.id, name: user.name, email: user.email },
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error.", data: null });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existUser = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (existUser.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email.",
        data: null,
      });
    }
    const validPassword = await bcrypt.compare(
      password,
      existUser.rows[0].password_hash
    );
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid password.",
        data: null,
      });
    }
    const token = jwt.sign(
      {
        id: existUser.rows[0].id,
        email: existUser.rows[0].email,
        name: existUser.rows[0].name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return res.status(200).json({
      success: true,
      message: "User logged in successfully!",
      data: {
        token,
        user: {
          id: existUser.rows[0].id,
          name: existUser.rows[0].name,
          email: existUser.rows[0].email,
        },
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error.", data: null });
  }
};

module.exports = {
  register,
  login,
};
