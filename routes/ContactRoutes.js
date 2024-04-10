const express = require("express");
const { contactUs } = require("../controllers/ContactController");
const router = express.Router();

router.route("/send-email").post(contactUs);

module.exports = router;
