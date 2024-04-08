const express = require("express");
const { createAdvert } = require("../controllers/AdvertController");
const router = express.Router();

router.route("/").post(createAdvert);

module.exports = router;
