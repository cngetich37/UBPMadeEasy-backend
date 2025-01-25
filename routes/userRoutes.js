const express = require("express");
const {
  registerUser,
  loginUser,
  currentUser,
  forgotPassword,
  resetPassword,
  sendEmail,
  sendEmailCnetech
} = require("../controllers/UserController");
const validToken = require("../middleware/validateTokenHandler");
const router = express.Router();

router.post("/signup", registerUser);

router.post("/login", loginUser);
router.post("/send-email",sendEmail);
router.post("/contact",sendEmailCnetech);

router.get("/current", validToken, currentUser);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
