const express = require("express");
const multer = require("multer");
const upload = multer();
const {
  createUBP,
  getUBPActivity,
  getUbpDictionary,
  getSuggestions,
  uploadUBP,
  updateUBP,
  AllUBPActivities,
  createIndustry,
  AllUBPIndustries,
  getUBPIndustryCode,
  uploadBusinessCategories,
  getUBPBusinessCategoryCode,
  uploadBusinessSubCategories,
  getUBPBusinessSubCategoryCode,
  uploadBusinessActivities,
  getUBPBusinessActivityCode,
} = require("../controllers/UBPController");
const router = express.Router();

router.route("/ubpdictionary").get(getUbpDictionary);
router.route("/ubpdictionary/:commonBusinessActivity").get(getSuggestions);
router.route("/").post(createUBP);
router.route("/industry").post(createIndustry);
router.route("/industry").get(AllUBPIndustries);
router.route("/industry/:industryCode").get(getUBPIndustryCode);
router
  .route("/businesscategories/:businessCategoryCode")
  .get(getUBPBusinessCategoryCode);
router
  .route("/businesssubcategories/:businessSubCategoryCode")
  .get(getUBPBusinessSubCategoryCode);
router
  .route("/businessactivities/:businessActivityCode")
  .get(getUBPBusinessActivityCode);
router.route("/").get(AllUBPActivities);
router.route("/:commonBusinessActivity").get(getUBPActivity);
router.route("/uploadUBP").post(upload.single("file"), uploadUBP);
router.route("/updateUBP").post(upload.single("file"), updateUBP);
router
  .route("/uploadBusinessCategories")
  .post(upload.single("file"), uploadBusinessCategories);
router
  .route("/uploadBusinessSubCategories")
  .post(upload.single("file"), uploadBusinessSubCategories);
router
  .route("/uploadBusinessActivities")
  .post(upload.single("file"), uploadBusinessActivities);
module.exports = router;
