const express = require("express");
const {
  createUBP,
  AllUBPActivities,
  getUBPActivity
  
} = require("../controllers/UBPController");
const router = express.Router();

router.route("/").get(AllUBPActivities);
router.route("/").post(createUBP);
router.route("/:commonBusinessActivity").get(getUBPActivity);

module.exports = router;
