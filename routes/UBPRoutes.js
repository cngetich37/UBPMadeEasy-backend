const express = require("express");
const multer = require("multer");
const upload = multer();
const {
  createUBP,
  getUBPActivity,
  getUbpDictionary,
  getSuggestions,
  uploadUBP,
} = require("../controllers/UBPController");
const router = express.Router();

router.route("/ubpdictionary").get(getUbpDictionary);
router.route("/ubpdictionary/:commonBusinessActivity").get(getSuggestions);
router.route("/").post(createUBP);
router.route("/:commonBusinessActivity").get(getUBPActivity);
router.route("/uploadUBP").post(upload.single("file"), uploadUBP);
module.exports = router;
