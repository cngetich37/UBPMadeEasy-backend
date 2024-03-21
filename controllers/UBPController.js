const asyncHandler = require("express-async-handler");
const UBP = require("../models/UBPModel");
const Industry = require("../models/IndustryModel");
const BusinessCategory = require("../models/BusinessCategoryModel");
const BusinessSubCategory = require("../models/BusinessSubCategoryModel");
const { Error } = require("mongoose");

// @desc Get All UBP Activities
// @route GET /api/naics
// @access public
const AllUBPActivities = asyncHandler(async (req, res) => {
  const ubpActivities = await UBP.find();
  res.status(200).json(ubpActivities);
});

// @desc Get All UBP Industries
// @route GET /api/naics/industry
// @access public
const AllUBPIndustries = asyncHandler(async (req, res) => {
  const ubpIndustries = await Industry.find();
  res.status(200).json(ubpIndustries);
});

// @desc Create UBP
// @route POST /api/naics
// @access public
const createUBP = asyncHandler(async (req, res) => {
  // Extract fields from the request body
  const { commonBusinessActivity, naicsCode } = req.body;

  // Check if required fields are provided
  if (!naicsCode || !commonBusinessActivity) {
    res.status(400);
    throw new Error("NAICS code & CommonBusiness Activity are required");
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
    res.status(500);
    throw new Error("Internal server error");
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
    res.status(404);
    throw new Error("Business Activity not found");
  } else {
    res.status(200).json(ubpActivity);
  }
});

// @desc Get the Common Business Activities
// @route GET /api/naics/ubpdictionary
// @access public
const getUbpDictionary = asyncHandler(async (req, res) => {
  try {
    //UBP is a model representing suggestions, modify the query accordingly
    const ubpDictionary = await UBP.find(
      {},
      { commonBusinessActivity: 1, _id: 0 }
    );

    res.status(200).json(ubpDictionary);
  } catch (error) {
    res.status(500);
    throw new Error("Server Error");
  }
});

// @desc Get a UBP Activity by Common Business Activity
// @route GET /api/naics/ubpdictionary/:commonBusinessActivity
// @access public
const getSuggestions = asyncHandler(async (req, res) => {
  const { commonBusinessActivity } = req.params;

  try {
    // Create a regex pattern to match partial input anywhere within the string
    const regexPattern = new RegExp(`${commonBusinessActivity}`, "i");

    // Search for business activities that contain the partial input value
    const ubpActivities = await UBP.find(
      { commonBusinessActivity: { $regex: regexPattern } },
      { commonBusinessActivity: 1, _id: 0 }
    );

    // Extract only the "commonBusinessActivity" field from the documents
    const suggestions = ubpActivities.map(
      (activity) => activity.commonBusinessActivity
    );

    if (suggestions.length === 0) {
      // No matching suggestions found
      res.status(404);
      throw new Error("No matching suggestions found");
    } else {
      // Return the matching suggestions
      res.status(200).json({ suggestions });
    }
  } catch (error) {
    // Handle errors
    res.status(500);
    throw new Error("Internal server error");
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
      res.status(400);
      throw new Error("Common Business Activity and NAICS Code are required");
    }

    // Check if arrays have the same length
    if (commonBusinessActivity.length !== naicsCode.length) {
      res.status(400);
      throw new Error(
        "Common Business Activity and NAICS Code arrays must have the same length"
      );
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
        res.status(400);
        throw new Error("UBP Activity already exists");
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

    res.status(201).json({
      message: "Business Activities added successfully",
      createdEntries,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Internal server error");
  }
});

// @desc update bulk UBP
// @route POST /api/naics/updateUBP
// @access public

const updateUBP = asyncHandler(async (req, res) => {
  try {
    const { commonBusinessActivity, naicsCode } = req.body;

    if (!commonBusinessActivity || !naicsCode) {
      res.status(400);
      throw new Error("Common Business Activity and NAICS Code are required");
    }

    if (commonBusinessActivity.length !== naicsCode.length) {
      res.status(400);
      throw new Error(
        "Common Business Activity and NAICS Code arrays must have the same length"
      );
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
    res.status(500);
    throw new Error("Internal server error");
  }
});

// @desc Create the UBP Industry
// @route POST /api/naics/industry
// @access public
const createIndustry = asyncHandler(async (req, res) => {
  // Extract the from the industry and industry code
  const { industry, industryCode } = req.body;

  // Check if required fields are provided
  if (!industry || !industryCode) {
    res.status(400);
    throw new Error("Industry & Industrycode are required!");
  }

  // Check if industry with the same industry code already exists
  const existingIndustry = await Industry.findOne({ industryCode });
  if (existingIndustry) {
    res.status(400);
    throw new Error("An industry with the same industry code already exists!");
  }

  // Check if UBP Industry already exists
  const regex = new RegExp(`^${industry}$`, "i");
  const UBPIndustry = await Industry.findOne({ industry: regex });
  if (UBPIndustry) {
    res.status(400);
    throw new Error("UBP Industry already exists!");
  }

  // Add the Industry and the Industry Code
  const industryCategories = {
    industry: industry,
    industryCode: industryCode,
  };

  try {
    // Create UBP Industry
    await Industry.create(industryCategories);
    res.status(201).json({ message: "Industry added successfully" });
  } catch (error) {
    res.status(500);
    throw new Error("Error adding Industry!");
  }
});

// @desc Get a UBP Industry by industry code
// @route GET /api/naics/industry/:industryCode
// @access public
const getUBPIndustryCode = asyncHandler(async (req, res) => {
  const { industryCode } = req.params;

  // Search for the specific Industry
  let regex;
  if (industryCode.includes("-")) {
    regex = new RegExp(`^${industryCode}$`, "i");
  } else {
    regex = new RegExp(
      `^(${industryCode}|\\d+-${industryCode}|${industryCode}-\\d+)$`,
      "i"
    );
  }

  const ubpIndustry = await Industry.findOne({ industryCode: regex });

  if (!ubpIndustry) {
    res.status(404);
    throw new Error("Industry not found");
  } else {
    res.status(200).json(ubpIndustry);
  }
});

// @desc upload Business Categories
// @route POST /api/naics/uploadBusinessCategories
// @access public

const uploadBusinessCategories = asyncHandler(async (req, res) => {
  try {
    const { businessCategory, businessCategoryCode } = req.body;

    if (!businessCategory || !businessCategoryCode) {
      res.status(400);
      throw new Error(
        "Business Category and Business Category Code are required"
      );
    }

    if (businessCategory.length !== businessCategoryCode.length) {
      res.status(400);
      throw new Error(
        "Business Category and Business Category Code arrays must have the same length"
      );
    }

    const createdEntries = [];
    for (let i = 0; i < businessCategory.length; i++) {
      const BusinessCategoryItem = businessCategory[i];
      const businessCategoryCodeItem = businessCategoryCode[i];

      const regex = new RegExp(`^${BusinessCategoryItem}$`, "i");
      let BusinessCategoryAvailable = await BusinessCategory.findOne({
        businessCategory: regex,
      });

      if (BusinessCategoryAvailable) {
        // If UBP entry already exists, update it
        BusinessCategoryAvailable.businessCategory = BusinessCategoryItem;
        BusinessCategoryAvailable.businessCategoryCode =
          businessCategoryCodeItem;
        await BusinessCategoryAvailable.save();
        createdEntries.push(BusinessCategoryAvailable);
      } else {
        // If UBP entry doesn't exist, create a new one
        const businessCategories = {
          businessCategory: BusinessCategoryItem,
          businessCategoryCode: businessCategoryCodeItem,
        };
        const createdEntry = await BusinessCategory.create(businessCategories);
        createdEntries.push(createdEntry);
      }
    }

    res.status(201).json({
      message: "Business Categories added successfully",
      createdEntries,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Internal server error");
  }
});

// @desc Get a UBP Business Categories by business category code
// @route GET /api/naics/businesscategories/:businessCategoryCode
// @access public
const getUBPBusinessCategoryCode = asyncHandler(async (req, res) => {
  const { businessCategoryCode } = req.params;

  // Search for the specific Industry
  let regex;
  if (businessCategoryCode.includes("-")) {
    regex = new RegExp(`^${businessCategoryCode}$`, "i");
  } else {
    regex = new RegExp(
      `^(${businessCategoryCode}|\\d+-${businessCategoryCode}|${businessCategoryCode}-\\d+)$`,
      "i"
    );
  }

  const ubpBusinessCategory = await BusinessCategory.findOne({
    businessCategoryCode: regex,
  });

  if (!ubpBusinessCategory) {
    res.status(404);
    throw new Error("Business Category not found!");
  } else {
    res.status(200).json(ubpBusinessCategory);
  }
});

// @desc upload Business SubCategories
// @route POST /api/naics/uploadBusinessSubCategories
// @access public

const uploadBusinessSubCategories = asyncHandler(async (req, res) => {
  try {
    const { businessSubCategory, businessSubCategoryCode } = req.body;

    if (!businessSubCategory || !businessSubCategoryCode) {
      res.status(400);
      throw new Error(
        "Business SubCategory and Business SubCategory Code are required"
      );
    }

    if (businessSubCategory.length !== businessSubCategoryCode.length) {
      res.status(400);
      throw new Error(
        "Business SubCategory and Business SubCategory Code arrays must have the same length"
      );
    }

    const createdEntries = [];
    for (let i = 0; i < businessSubCategory.length; i++) {
      const BusinessSubCategoryItem = businessSubCategory[i];
      const businessSubCategoryCodeItem = businessSubCategoryCode[i];

      const regex = new RegExp(`^${BusinessSubCategoryItem}$`, "i");
      let BusinessSubCategoryAvailable = await BusinessSubCategory.findOne({
        businessSubCategory: regex,
      });

      if (BusinessSubCategoryAvailable) {
        // If UBP entry already exists, update it
        BusinessSubCategoryAvailable.businessSubCategory =
          BusinessSubCategoryItem;
        BusinessSubCategoryAvailable.businessSubCategoryCode =
          businessSubCategoryCodeItem;
        await BusinessSubCategoryAvailable.save();
        createdEntries.push(BusinessSubCategoryAvailable);
      } else {
        // If UBP entry doesn't exist, create a new one
        const businessSubCategories = {
          businessSubCategory: BusinessSubCategoryItem,
          businessSubCategoryCode: businessSubCategoryCodeItem,
        };
        const createdEntry = await BusinessSubCategory.create(
          businessSubCategories
        );
        createdEntries.push(createdEntry);
      }
    }

    res.status(201).json({
      message: "Business SubCategories added successfully",
      createdEntries,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Internal server error");
  }
});

// @desc Get a UBP Business SubCategories by business Subcategory code
// @route GET /api/naics/businesssubcategories/:businesssubCategoryCode
// @access public
const getUBPBusinessSubCategoryCode = asyncHandler(async (req, res) => {
  const { businessSubCategoryCode } = req.params;

  // Search for the specific Business SubCategory
  let regex;
  if (businessSubCategoryCode.includes("-")) {
    regex = new RegExp(`^${businessSubCategoryCode}$`, "i");
  } else {
    regex = new RegExp(
      `^(${businessSubCategoryCode}|\\d+-${businessSubCategoryCode}|${businessSubCategoryCode}-\\d+)$`,
      "i"
    );
  }

  const ubpBusinessSubCategory = await BusinessSubCategory.findOne({
    businessSubCategoryCode: regex,
  });

  if (!ubpBusinessSubCategory) {
    res.status(404);
    throw new Error("Business SubCategory not found!");
  } else {
    res.status(200).json(ubpBusinessSubCategory);
  }
});
module.exports = {
  AllUBPActivities,
  AllUBPIndustries,
  createUBP,
  getUBPActivity,
  getUbpDictionary,
  getSuggestions,
  uploadUBP,
  updateUBP,
  createIndustry,
  getUBPIndustryCode,
  uploadBusinessCategories,
  getUBPBusinessCategoryCode,
  uploadBusinessSubCategories,
  getUBPBusinessSubCategoryCode
};
