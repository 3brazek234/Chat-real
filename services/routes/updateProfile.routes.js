const express = require("express");
const router = express.Router();
const upload = require("../middleware/multerUpload");
const authenticateToken = require("../middleware/authenticateToken");
const {
  updateImage,
  updateProfile,
  getProfile,
} = require("../controlers/updateProfile.controler");
router.put(
  "/update-profile-image",
  authenticateToken,
  upload.single("avatar"),
  updateImage
);

router.put("/update-profile", authenticateToken, updateProfile);
router.get("/get-profile", authenticateToken, getProfile);
module.exports = router;
