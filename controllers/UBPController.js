const asyncHandler = require("express-async-handler");
const UBP = require("../models/UBPModel");

// @desc Get All UBP Activities
// @route GET /api/naics
// @access public
const AllUBPActivities = asyncHandler(async (req, res) => {
  const ubpActivities = await UBP.find();
  res.status(200).json(ubpActivities);
});

// @desc Create UBP
// @route POST /api/naics
// @access public

const createUBP = asyncHandler(async (req, res) => {
  const { commonBusinessActivity, naicsCode } = req.body;
  if (!naicsCode || !commonBusinessActivity) {
    return res
      .status(400)
      .json({ error: "NAICS code & CommonBusiness Activity are required" });
  }
  const UBPAvailable = await UBP.findOne({ commonBusinessActivity });
  if (UBPAvailable) {
    res.status(400);
    throw new Error("UBP Activity already exists!");
  }

  // Break NAICS code into four categories
  const naicsCategories = {
    commonBusinessActivity: commonBusinessActivity,
    industry: naicsCode.substring(0, 2),
    businessCategory: naicsCode.substring(0, 3),
    businessSubCategory: naicsCode.substring(0, 4),
    businessActivity: naicsCode.substring(0, 5),
  };

  try {
    await UBP.create(naicsCategories);
    res
      .status(201)
      .json({ message: "UBP Business Activity added successfully" });
  } catch (error) {
    console.error("Error adding UBP Business Activity:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = {
  createUBP,
  AllUBPActivities,
};
