const express = require("express");
const {
  registerUser,
  loginUser,
  currentUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/UserController");
const validToken = require("../middleware/validateTokenHandler");
const router = express.Router();

router.post("/signup", registerUser);

router.post("/login", loginUser);

router.get("/current", validToken, currentUser);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
