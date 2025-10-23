const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res
      .status(401)
      .json({
        success: false,
        message: "Authentication token required.",
        data: null,
      });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Invalid or expired token.",
          data: null,
        });
    }
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
