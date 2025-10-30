const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");
const { getUsers } = require("../controlers/getUsers");
router.get("/users", authenticateToken, getUsers);
module.exports = router;