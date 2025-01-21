const asyncHandler = require("express-async-handler");
const Advert = require("../models/AdvertModel");

// @desc Create Advert
// @route POST /api/advert
// @access public
const createAdvert = asyncHandler(async (req, res) => {
  // Extract fields from the request body
  const {
    advertType,
    advertisementCategory,
    subCategoryOne,
    subCategoryTwo,
    applicationFee,
    firstThreeMetres,
    firstSquareMetres,
    firstTenSquareMetres,
    extraSquareMetres,
    perEachperYear,
    licenseFee,
  } = req.body;

  // console.log("Request Body:", req.body);

  // Check if required fields are provided
  if (
    !advertType ||
    !advertisementCategory ||
    !subCategoryOne ||
    !subCategoryTwo ||
    !applicationFee ||
    !firstThreeMetres ||
    !firstSquareMetres ||
    !firstTenSquareMetres ||
    !extraSquareMetres ||
    !perEachperYear ||
    !licenseFee
  ) {
    // console.log("Validation Failed:", {
    //   advertType,
    //   advertisementCategory,
    //   subCategoryOne,
    //   subCategoryTwo,
    //   applicationFee,
    //   firstThreeMetres,
    //   firstSquareMetres,
    //   firstTenSquareMetres,
    //   extraSquareMetres,
    //   perEachperYear,
    //   licenseFee,
    // });

    res.status(400);
    throw new Error(
      "advertType, advertisementCategory, subCategoryOne, subCategoryTwo, applicationFee, firstThreeMetres, firstSquareMetres, firstTenSquareMetres, extraSquareMetres, perEachperYear are required"
    );
  }

  // Check if Advert already exists
  const regex = new RegExp(`^${advertType}$`, "i");
  const advertAvailable = await Advert.findOne({ advertType: regex });
  if (advertAvailable) {
    // console.log("Advert Type Already Exists:", advertType);
    return res.status(400).json({ error: "Advert type already exists!" });
  }

  try {
    // Create Advert Type
    // console.log("Creating Advert:", req.body);
    await Advert.create(req.body);
    res.status(201).json({ message: "Advert type added successfully" });
  } catch (error) {
    console.error("Error creating advert:", error);
    res.status(500);
    throw new Error("Internal server error");
  }
});

// @desc Get a UBP Activity by Common Business Activity
// @route GET /api/advert/:advertType
// @access public
const getAdvertType = asyncHandler(async (req, res) => {
  const { advertType } = req.params;

  // Create regular expressions to match both singular and plural forms
  const singularRegex = new RegExp(`^${advertType}$`, "i");
  const pluralRegex = new RegExp(`^${advertType}s?$`, "i");

  // Create text search regex for specific patterns
  const textSearchRegex = new RegExp(
    `${advertType.replace(/\(/g, "\\(").replace(/\)/g, "\\)")}`,
    "i"
  );

  // Search for both singular, plural forms, and text search
  const advertActivity = await Advert.findOne({
    $or: [
      { advertType: singularRegex },
      { advertType: pluralRegex },
      { advertType: textSearchRegex },
    ],
  });

  if (!advertActivity) {
    res.status(404);
    throw new Error("Advert Type not found");
  } else {
    res.status(200).json(advertActivity);
  }
});

// @desc Get the Common advert types
// @route GET /api/advert
// @access public
const getAdvertDictionary = asyncHandler(async (req, res) => {
  try {
    //Advert is a model representing suggestions, modify the query accordingly
    const advertDictionary = await Advert.find(
      {},
      { advertType: 1, _id: 0 }
    );

    res.status(200).json(advertDictionary);
  } catch (error) {
    res.status(500);
    throw new Error("Server Error");
  }
});

module.exports = { createAdvert, getAdvertType,getAdvertDictionary };
