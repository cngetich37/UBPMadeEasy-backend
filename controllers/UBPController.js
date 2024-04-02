const asyncHandler = require("express-async-handler");
const UBP = require("../models/UBPModel");
const Industry = require("../models/IndustryModel");
const BusinessCategory = require("../models/BusinessCategoryModel");
const BusinessSubCategory = require("../models/BusinessSubCategoryModel");
const BusinessActivity = require("../models/BusinessActivityModel");
const FinanceAct = require("../models/FinanceActModel");
const { Error } = require("mongoose");

// @desc Get UBP common Business Activities
// @route GET /api/naics
// @access public
const UBPActivities = asyncHandler(async (req, res) => {
  const ubpActivities = await UBP.find();
  res.status(200).json(ubpActivities);
});

// @desc Get UBP Industries
// @route GET /api/naics/industries
// @access public
const UBPIndustries = asyncHandler(async (req, res) => {
  const ubpIndustries = await Industry.find();
  res.status(200).json(ubpIndustries);
});
// @desc Get UBP Finance Act
// @route GET /api/naics/financeact
// @access public
const UBPFinanceAct = asyncHandler(async (req, res) => {
  try {
    const ubpFinance = await FinanceAct.find();

    // Function to recursively replace undefined values with "0"
    const replaceUndefined = (obj) => {
      for (let key in obj) {
        if (obj[key] === undefined) {
          obj[key] = "0";
        } else if (typeof obj[key] === "object") {
          replaceUndefined(obj[key]);
        }
      }
      return obj;
    };

    // Filter out undefined strings and replace them with "0"
    const filteredFinance = ubpFinance.map((item) => {
      return replaceUndefined(item.toObject());
    });

    res.status(200).json(filteredFinance);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc Get UBP Business Categories
// @route GET /api/naics/businesscategories
// @access public
const UBPBusinessCategories = asyncHandler(async (req, res) => {
  const ubpBusinessCategories = await BusinessCategory.find();
  res.status(200).json(ubpBusinessCategories);
});

// @desc Get UBP Business subCategories
// @route GET /api/naics/businesscategories
// @access public
const UBPBusinessSubCategories = asyncHandler(async (req, res) => {
  const ubpBusinessSubCategories = await BusinessSubCategory.find();
  res.status(200).json(ubpBusinessSubCategories);
});

// @desc Get UBP Business subCategories
// @route GET /api/naics/businessactivities
// @access public
const UBPBusinessActivities = asyncHandler(async (req, res) => {
  const ubpBusinessActivities = await BusinessActivity.find();
  res.status(200).json(ubpBusinessActivities);
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

  // Create text search regex for specific patterns
  const textSearchRegex = new RegExp(
    `${commonBusinessActivity.replace(/\(/g, "\\(").replace(/\)/g, "\\)")}`,
    "i"
  );

  // Search for both singular, plural forms, and text search
  const ubpActivity = await UBP.findOne({
    $or: [
      { commonBusinessActivity: singularRegex },
      { commonBusinessActivity: pluralRegex },
      { commonBusinessActivity: textSearchRegex },
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
  try {
    const { businessSubCategoryCode } = req.params;

    console.log("Business SubCategory Code:", businessSubCategoryCode);

    let regex;
    if (businessSubCategoryCode.includes("-")) {
      regex = new RegExp(`^${businessSubCategoryCode}$`, "i");
    } else {
      regex = new RegExp(
        `^(${businessSubCategoryCode}|\\d+-${businessSubCategoryCode}|${businessSubCategoryCode}-\\d+)$`,
        "i"
      );
    }

    console.log("Regex:", regex);

    const ubpBusinessSubCategory = await BusinessSubCategory.findOne({
      businessSubCategoryCode: regex,
    });

    console.log("Business SubCategory found:", ubpBusinessSubCategory);

    if (!ubpBusinessSubCategory) {
      res.status(404).json({ error: "Business SubCategory not found!" });
    } else {
      res.status(200).json(ubpBusinessSubCategory);
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// @desc Upload UBP Bulk Business Activities
// @route GET /api/naics/uploadBusinessActivities
// @access public
const uploadBusinessActivities = asyncHandler(async (req, res) => {
  try {
    console.log("Request body:", req.body); // Log the entire request body

    // Extract businessActivities array from request body
    const { businessActivities } = req.body;

    // Check if businessActivities array is provided and is an array
    if (!businessActivities || !Array.isArray(businessActivities)) {
      return res.status(400).json({
        error: "Business activities array is required",
      });
    }

    // Prepare bulk operations to update or insert entries in the database
    const bulkOperations = businessActivities.map(activity => ({
      updateOne: {
        filter: {
          businessActivityCode: activity.businessActivityCode,
        },
        update: { $set: activity },
        upsert: true,
      },
    }));

    // Execute bulk operations to update or insert entries into the database
    const result = await BusinessActivity.bulkWrite(bulkOperations);

    // Respond with success message and result
    return res.status(201).json({
      message: "Business activities added/updated successfully",
      result,
    });
  } catch (error) {
    console.error("Error in uploadBusinessActivities:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});




// @desc Upload FinanceAct
// @route GET /api/naics/uploadFinanceAct
// @access public
const uploadFinanceAct = asyncHandler(async (req, res) => {
  try {
    const {
      brimCode,
      naicsCode,
      subCategory,
      businessDescription,
      tradeLicence,
      fireClearance,
      foodHygiene,
      healthCertificate,
      pestControl,
    } = req.body;

    if (
      !brimCode ||
      !naicsCode ||
      !subCategory ||
      !businessDescription ||
      !tradeLicence ||
      !fireClearance ||
      !foodHygiene ||
      !healthCertificate ||
      !pestControl
    ) {
      return res.status(400).json({
        error: "All fields  are required!",
      });
    }

    if (
      brimCode.length !== naicsCode.length ||
      brimCode.length !== subCategory.length ||
      brimCode.length !== businessDescription.length ||
      brimCode.length !== tradeLicence.length ||
      brimCode.length !== fireClearance.length ||
      brimCode.length !== foodHygiene.length ||
      brimCode.length !== healthCertificate.length ||
      brimCode.length !== pestControl.length
    ) {
      return res.status(400).json({
        error: "All fields must have the same length",
      });
    }

    const createdEntries = [];
    for (let i = 0; i < brimCode.length; i++) {
      const brimCodeItem = brimCode[i];
      const naicsCodeItem = naicsCode[i];
      const subCategoryItem = subCategory[i];
      const businessDescriptionItem = businessDescription[i];
      const tradeLicenceItem = tradeLicence[i];
      const fireClearanceItem = fireClearance[i];
      const foodHygieneItem = foodHygiene[i];
      const healthCertificateItem = healthCertificate[i];
      const pestControlItem = pestControl[i];

      // checks
      const maxLength = 255; // Define your maximum length here
      let description = "";

      // Convert to string if not already a string
      if (typeof businessDescription === "string") {
        description = businessDescription;
      } else if (typeof businessDescription === "object") {
        // Convert object to string
        description = JSON.stringify(businessDescription);
      } else {
        // For other types, use default string conversion
        description = String(businessDescription);
      }

      const escapedDescription = description.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );
      const regex = new RegExp(
        `^${escapedDescription.substring(0, maxLength)}$`,
        "i"
      );
      let businessDescriptionAvailable = await FinanceAct.findOne({
        businessDescription: regex,
      });

      if (businessDescriptionAvailable) {
        // If Finanace Act Item already exists, update it
        businessDescriptionAvailable.brimCode = brimCodeItem;
        businessDescriptionAvailable.naicsCode = naicsCodeItem;
        businessDescriptionAvailable.subCategory = subCategoryItem;
        businessDescriptionAvailable.businessDescription =
          businessDescriptionItem;
        businessDescriptionAvailable.tradeLicence = tradeLicenceItem;
        businessDescriptionAvailable.fireClearance = fireClearanceItem;
        businessDescriptionAvailable.foodHygiene = foodHygieneItem;
        businessDescriptionAvailable.healthCertificate = healthCertificateItem;
        businessDescriptionAvailable.pestControl = pestControlItem;
        await businessDescriptionAvailable.save();
        createdEntries.push(businessDescriptionAvailable);
      } else {
        // If the Finance Act doesn't exist, create a new one
        const financeAct = {
          brimCode: brimCodeItem,
          naicsCode: naicsCodeItem,
          subCategory: subCategoryItem,
          businessDescription: businessDescriptionItem,
          tradeLicence: tradeLicenceItem,
          fireClearance: fireClearanceItem,
          foodHygiene: foodHygieneItem,
          healthCertificate: healthCertificateItem,
          pestControl: pestControlItem,
        };
        const createdEntry = await FinanceAct.create(financeAct);
        createdEntries.push(createdEntry);
      }
    }
    return res.status(201).json({
      message: "Finance Act added successfully",
      createdEntries,
    });
  } catch (error) {
    console.error("Error in uploading Finance Act:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
// @desc Get a UBP Business SubCategories by business Subcategory code
// @route GET /api/naics/businessactivities/:businessActivityCode
// @access public
const getUBPBusinessActivityCode = asyncHandler(async (req, res) => {
  try {
    const { businessActivityCode } = req.params;

    console.log("Business Activity Code:", businessActivityCode);

    let regex;
    if (businessActivityCode.includes("-")) {
      regex = new RegExp(`^${businessActivityCode}$`, "i");
    } else {
      regex = new RegExp(
        `^(${businessActivityCode}|\\d+-${businessActivityCode}|${businessActivityCode}-\\d+)$`,
        "i"
      );
    }

    console.log("Regex:", regex);

    const ubpBusinessActivity = await BusinessActivity.findOne({
      businessActivityCode: regex,
    }).exec();

    console.log("Business Activity found:", ubpBusinessActivity);

    if (!ubpBusinessActivity) {
      res.status(404).json({ error: "Business Activity not found!" });
      return; // Exit the function early
    }

    const financeActs = await FinanceAct.find({ naicsCode: ubpBusinessActivity.businessTradeCode });

    console.log("Finance Acts found:", financeActs);

    if (!financeActs) {
      res.status(404).json({ error: "Finance Acts not found!" });
    } else {
      const response = {
        ...ubpBusinessActivity.toObject(),
        financeActs: financeActs.map(financeAct => financeAct.toObject())
      };
      res.status(200).json(response);
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// @desc Get the Finance Act by naics code
// @route GET /api/naics/financeact/:naicsCode
// @access public
const getNaicsCodeFinanceAct = asyncHandler(async (req, res) => {
  try {
    const { naicsCode } = req.params;

    console.log("Naics Code:", naicsCode);

    let regex;
    if (naicsCode.includes("-")) {
      regex = new RegExp(`^${naicsCode}$`, "i");
    } else {
      regex = new RegExp(
        `^(${naicsCode}|\\d+-${naicsCode}|${naicsCode}-\\d+)$`,
        "i"
      );
    }

    console.log("Regex:", regex);

    const ubpFinanceAct = await FinanceAct.find({
      naicsCode: regex,
    });

    console.log("Finance Act found:", ubpFinanceAct);

    if (!ubpFinanceAct) {
      res.status(404).json({ error: "Finance Act naics code not found!" });
    } else {
      res.status(200).json(ubpFinanceAct);
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = {
  UBPActivities,
  UBPIndustries,
  UBPBusinessCategories,
  UBPBusinessSubCategories,
  UBPBusinessActivities,
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
  getUBPBusinessSubCategoryCode,
  uploadBusinessActivities,
  getUBPBusinessActivityCode,
  uploadFinanceAct,
  getNaicsCodeFinanceAct,
  UBPFinanceAct,
};
