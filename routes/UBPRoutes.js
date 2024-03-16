const express = require("express");
const {
  createUBP,
  getUBPActivity,
  getUbpDictionary,
  getSuggestions,
} = require("../controllers/UBPController");
const router = express.Router();

router.route("/ubpdictionary").get(getUbpDictionary);
router.route("/ubpdictionary/:commonBusinessActivity").get(getSuggestions);
router.route("/").post(createUBP);
router.route("/:commonBusinessActivity").get(getUBPActivity);
// router.route("/:value").get(getUBPActivity);

module.exports = router;
