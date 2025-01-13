const express = require("express");
const {
    doSearch
} = require("../controllers/SearchController");
const router = express.Router();

router.route("/").post(doSearch);


module.exports = router;