const express = require("express");
const router = express.Router();
const { registerSchema, loginSchema } = require("../validation/auth");
const validate = require("../middleware/validationMiddleware");
const { register, login } = require("../controlers/auth.controler");
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
module.exports = router;
