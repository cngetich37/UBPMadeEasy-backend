const mongoose = require("mongoose");

const advertSchema = mongoose.Schema(
  {
    advertType: {
      type: String,
      required: [true, "Please provide the advert type"],
    },
    advertisementCategory: {
      type: String,
      required: [true, "Please provide the advertisement category"],
    },
    subCategoryOne: {
      type: String,
      required: [true, "Please provide the subcategory one"],
    },
    subCategoryTwo: {
      type: String,
      required: [true, "Please provide the subcategory two"],
    },
    applicationFee: {
      type: Number,
      required: false,
      default: 0,
    },
    firstThreeMetres: {
      type: Number,
      required: false,
      default: 0,
    },
    firstSquareMetres: {
      type: Number,
      required: false,
      default: 0,
    },
    firstTenSquareMetres: {
      type: Number,
      required: false,
      default: 0,
    },
    extraSquareMetres: {
      type: Number,
      required: false,
      default: 0,
    },
    perEachperYear: {
      type: Number,
      required: false,
      default: 0,
    },
    licenseFee: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Advert", advertSchema);
