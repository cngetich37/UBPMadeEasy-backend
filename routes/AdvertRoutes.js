const express = require("express");
const {
  createAdvert,
  getAdvertType,
  getAdvertDictionary,
} = require("../controllers/AdvertController");
const router = express.Router();

router.route("/").post(createAdvert);
router.route("/").get(getAdvertDictionary);
router.route("/:advertType").get(getAdvertType);

module.exports = router;
