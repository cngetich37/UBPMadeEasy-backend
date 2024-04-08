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
    licenseFee
  } = req.body;

  console.log("Request Body:", req.body);

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
    !perEachperYear||
    !licenseFee
  ) {
    console.log("Validation Failed:", {
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
      licenseFee
    });

    res.status(400);
    throw new Error(
      "advertType, advertisementCategory, subCategoryOne, subCategoryTwo, applicationFee, firstThreeMetres, firstSquareMetres, firstTenSquareMetres, extraSquareMetres, perEachperYear are required"
    );
  }

  // Check if Advert already exists
  const regex = new RegExp(`^${advertType}$`, "i");
  const advertAvailable = await Advert.findOne({ advertType: regex });
  if (advertAvailable) {
    console.log("Advert Type Already Exists:", advertType);
    return res.status(400).json({ error: "Advert type already exists!" });
  }

  try {
    // Create Advert Type
    console.log("Creating Advert:", req.body);
    await Advert.create(req.body);
    res.status(201).json({ message: "Advert type added successfully" });
  } catch (error) {
    console.error("Error creating advert:", error);
    res.status(500);
    throw new Error("Internal server error");
  }
});

module.exports = { createAdvert };
