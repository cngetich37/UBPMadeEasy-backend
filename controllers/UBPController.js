const asyncHandler = require("express-async-handler");
const UBP = require("../models/UBPModel");

// @desc Get All UBP Activities
// @route GET /api/naics
// @access public
// const AllUBPActivities = asyncHandler(async (req, res) => {
//   const ubpActivities = await UBP.find();
//   res.status(200).json(ubpActivities);
// });

// @desc Create UBP
// @route POST /api/naics
// @access public
const createUBP = asyncHandler(async (req, res) => {
  // Extract fields from the request body
  const { commonBusinessActivity, naicsCode } = req.body;

  // Check if required fields are provided
  if (!naicsCode || !commonBusinessActivity) {
    return res
      .status(400)
      .json({ error: "NAICS code & CommonBusiness Activity are required" });
  }

  // Check if UBP Activity already exists
  const regex = new RegExp(`^${commonBusinessActivity}$`, "i");
  const UBPAvailable = await UBP.findOne({ commonBusinessActivity: regex });
  if (UBPAvailable) {
    return res.status(400).json({ error: "UBP Activity already exists!" });
  }

  // Break NAICS code into four categories and attach a Business Activity to it
  const naicsCategories = {
    commonBusinessActivity: commonBusinessActivity,
    industry: naicsCode.substring(0, 2),
    businessCategory: naicsCode.substring(0, 3),
    businessSubCategory: naicsCode.substring(0, 4),
    businessActivity: naicsCode.substring(0, 5),
  };

  try {
    // Create UBP Business Activity
    await UBP.create(naicsCategories);
    res.status(201).json({ message: "Business Activity added successfully" });
  } catch (error) {
    console.error("Error adding UBP Business Activity:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// @desc Get a UBP Activity by Common Business Activity
// @route GET /api/naics/:commonBusinessActivity
// @access public
const getUBPActivity = asyncHandler(async (req, res) => {
  const { commonBusinessActivity } = req.params;

  // Create regular expressions to match both singular and plural forms
  const singularRegex = new RegExp(`^${commonBusinessActivity}$`, "i");
  const pluralRegex = new RegExp(`^${commonBusinessActivity}s?$`, "i");

  // Search for both singular and plural forms
  const ubpActivity = await UBP.findOne({
    $or: [
      { commonBusinessActivity: singularRegex },
      { commonBusinessActivity: pluralRegex },
    ],
  });

  if (!ubpActivity) {
    res.status(404).json({ message: "Business Activity not found" });
  } else {
    res.status(200).json(ubpActivity);
  }
});

// @desc Get the Common Business Activities
// @route GET /api/naics/ubpdictionary
// @access public
const getUbpDictionary = asyncHandler(async (req, res) => {
  try {
    // Assuming UBP is a model representing suggestions, modify the query accordingly
    const ubpDictionary = await UBP.find(
      {},
      { commonBusinessActivity: 1, _id: 0 }
    ); // Adjust "commonBusinessActivity" to your actual field name

    res.status(200).json(ubpDictionary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc Get a UBP Activity by Common Business Activity
// @route GET /api/naics/ubpdictionary/:commonBusinessActivity
// @access public
const getSuggestions = asyncHandler(async (req, res) => {
  const { commonBusinessActivity } = req.params;

  // Create regular expressions to match both singular and plural forms
  const singularRegex = new RegExp(`^${commonBusinessActivity}$`, "i");
  const pluralRegex = new RegExp(`^${commonBusinessActivity}s?$`, "i");

  // Search for both singular and plural forms
  const ubpActivity = await UBP.findOne(
    {
      $or: [
        { commonBusinessActivity: singularRegex },
        { commonBusinessActivity: pluralRegex },
      ],
    },
    { commonBusinessActivity: 1, _id: 0 }
  ); // Include only the "commonBusinessActivity" field and exclude "_id"

  if (!ubpActivity) {
    res.status(404).json({ message: "Business Activity not found" });
  } else {
    // Extract only the "commonBusinessActivity" field from the document
    const { commonBusinessActivity } = ubpActivity;
    res.status(200).json({ commonBusinessActivity });
  }
});

// @desc upload bulk UBP
// @route POST /api/naics/uploadUBP
// @access public
const uploadUBP = asyncHandler(async (req, res) => {
  try {
    // Extract arrays from the request body
    const { commonBusinessActivity, naicsCode } = req.body;

    // Check if required fields are provided
    if (!commonBusinessActivity || !naicsCode) {
      return res
        .status(400)
        .json({
          error: "Common Business Activity and NAICS Code are required",
        });
    }

    // Check if arrays have the same length
    if (commonBusinessActivity.length !== naicsCode.length) {
      return res
        .status(400)
        .json({
          error:
            "Common Business Activity and NAICS Code arrays must have the same length",
        });
    }

    // Create UBP entries for each pair of commonBusinessActivity and naicsCode
    const createdEntries = [];
    for (let i = 0; i < commonBusinessActivity.length; i++) {
      const commonBusinessActivityItem = commonBusinessActivity[i];
      const naicsCodeItem = naicsCode[i];

      // Check if UBP Activity already exists
      const regex = new RegExp(`^${commonBusinessActivityItem}$`, "i");
      const UBPAvailable = await UBP.findOne({ commonBusinessActivity: regex });
      if (UBPAvailable) {
        return res
          .status(400)
          .json({
            error:
              "UBP Activity already exists for: " + commonBusinessActivityItem,
          });
      }

      // Break NAICS code into four categories and attach a Business Activity to it
      const naicsCategories = {
        commonBusinessActivity: commonBusinessActivityItem,
        industry: naicsCodeItem.substring(0, 2),
        businessCategory: naicsCodeItem.substring(0, 3),
        businessSubCategory: naicsCodeItem.substring(0, 4),
        businessActivity: naicsCodeItem.substring(0, 5),
      };

      // Create UBP Business Activity
      const createdEntry = await UBP.create(naicsCategories);
      createdEntries.push(createdEntry);
    }

    res
      .status(201)
      .json({
        message: "Business Activities added successfully",
        createdEntries,
      });
  } catch (error) {
    console.error("Error adding UBP Business Activities:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// @desc update bulk UBP
// @route PUT /api/naics/updateUBP
// @access public

const updateUBP = asyncHandler(async (req, res) => {
  try {
    const { commonBusinessActivity, naicsCode } = req.body;

    if (!commonBusinessActivity || !naicsCode) {
      return res.status(400).json({
        error: "Common Business Activity and NAICS Code are required",
      });
    }

    if (commonBusinessActivity.length !== naicsCode.length) {
      return res.status(400).json({
        error:
          "Common Business Activity and NAICS Code arrays must have the same length",
      });
    }

    const createdEntries = [];
    for (let i = 0; i < commonBusinessActivity.length; i++) {
      const commonBusinessActivityItem = commonBusinessActivity[i];
      const naicsCodeItem = naicsCode[i];

      const regex = new RegExp(`^${commonBusinessActivityItem}$`, "i");
      let UBPAvailable = await UBP.findOne({ commonBusinessActivity: regex });

      if (UBPAvailable) {
        // If UBP entry already exists, update it
        UBPAvailable.industry = naicsCodeItem.substring(0, 2);
        UBPAvailable.businessCategory = naicsCodeItem.substring(0, 3);
        UBPAvailable.businessSubCategory = naicsCodeItem.substring(0, 4);
        UBPAvailable.businessActivity = naicsCodeItem.substring(0, 5);
        await UBPAvailable.save();
        createdEntries.push(UBPAvailable);
      } else {
        // If UBP entry doesn't exist, create a new one
        const naicsCategories = {
          commonBusinessActivity: commonBusinessActivityItem,
          industry: naicsCodeItem.substring(0, 2),
          businessCategory: naicsCodeItem.substring(0, 3),
          businessSubCategory: naicsCodeItem.substring(0, 4),
          businessActivity: naicsCodeItem.substring(0, 5),
        };
        const createdEntry = await UBP.create(naicsCategories);
        createdEntries.push(createdEntry);
      }
    }

    res.status(201).json({
      message: "Business Activities updated successfully",
      createdEntries,
    });
  } catch (error) {
    console.error("Error adding UBP Business Activities:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = {
  createUBP,
  getUBPActivity,
  getUbpDictionary,
  getSuggestions,
  uploadUBP,
  updateUBP
};
