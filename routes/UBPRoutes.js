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
  UBPActivities,
  createIndustry,
  UBPIndustries,
  getUBPIndustryCode,
  uploadBusinessCategories,
  getUBPBusinessCategoryCode,
  uploadBusinessSubCategories,
  getUBPBusinessSubCategoryCode,
  uploadBusinessActivities,
  getUBPBusinessActivityCode,
  UBPBusinessCategories,
  UBPBusinessSubCategories,
  UBPBusinessActivities,
  getNaicsCodeFinanceAct,
  uploadFinanceAct,
  UBPFinanceAct,
} = require("../controllers/UBPController");
const UBPFinancaAct_One = require("../controllers/RemoveUndefined");
const router = express.Router();

router.route("/ubpdictionary").get(getUbpDictionary);
router.route("/ubpdictionary/:commonBusinessActivity").get(getSuggestions);
router.route("/").post(createUBP);
router.route("/industry").post(createIndustry);
router.route("/industries").get(UBPIndustries);
router.route("/businesscategories").get(UBPBusinessCategories);
router.route("/businesssubcategories").get(UBPBusinessSubCategories);
router.route("/businessactivities").get(UBPBusinessActivities);
router.route("/financeact").get(UBPFinanceAct);
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
router.route("/financeact/:naicsCode").get(getNaicsCodeFinanceAct);
router.route("/").get(UBPActivities);
router.route("/:commonBusinessActivity").get(getUBPActivity);
router.route("/removeUndefined").put(UBPFinancaAct_One);
router.route("/uploadUBP").post(upload.single("file"), uploadUBP);
router.route("/updateUBP").post(upload.single("file"), updateUBP);
router.route("/uploadFinanceAct").post(upload.single("file"), uploadFinanceAct);
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
