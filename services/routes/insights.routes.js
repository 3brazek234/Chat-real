const express = require("express");
const router = express.Router();
const { getInsights } = require("../controlers/getInsights.controler");
const authenticateToken = require("../middleware/authenticateToken");
router.get("/insights/:partenerId", authenticateToken, getInsights);
module.exports = router;
