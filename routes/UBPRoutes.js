const express = require("express");
const {
  createUBP,
  AllUBPActivities,
  
} = require("../controllers/UBPController");
const router = express.Router();

router.route("/").get(AllUBPActivities);
// router.route("/ubp").get(getIntracomTenders);
router.route("/").post(createUBP);

module.exports = router;
