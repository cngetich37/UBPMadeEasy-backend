const mongoose = require("mongoose");

const financeActSchema = mongoose.Schema(
  {
    brimCode: {
      type: String,
      required: [true, "Please add the brim code"],
    },
    naicsCode: {
      type: String,
      required: [true, "Please add the naics code"],
    },
    subCategory: {
      type: String,
      required: [true, "Please add the subcategory"],
    },
    businessDescription: {
      type: String,
      required: [true, "Please add the business description"],
    },
    tradeLicence: {
      type: String,
      required: [true, "Please add the trade licence"],
    },
    fireClearance: {
      type: String,
      required: [true, "Please add the fire clearance"],
    },
    foodHygiene: {
      type: String,
      required: [true, "Please add the food hygiene"],
    },
    healthCertificate: {
      type: String,
      required: [true, "Please add the health certificate"],
    },
    pestControl: {
      type: String,
      required: [true, "Please add the pest control"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FinanceAct", financeActSchema);
