const express = require("express");
const {
    makePrediction
} = require("../controllers/PredictController");
const router = express.Router();

router.route("/").post(makePrediction);


module.exports = router;