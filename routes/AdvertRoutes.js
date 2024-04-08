const express = require("express");
const {
  createAdvert,
  getAdvertType,
} = require("../controllers/AdvertController");
const router = express.Router();

router.route("/").post(createAdvert);
router.route("/:advertType").get(getAdvertType);

module.exports = router;
