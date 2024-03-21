const mongoose = require("mongoose");

const businessSubCategorySchema = mongoose.Schema(
  {
    businessSubCategory: {
      type: String,
      required: [true, "Please add the business subcategory"],
    },
    businessSubCategoryCode: {
      type: String,
      required: [true, "Please add the business subcategory code"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "BusinessSubCategory",
  businessSubCategorySchema
);
