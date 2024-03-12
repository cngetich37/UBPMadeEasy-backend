const mongoose = require("mongoose");

const ubpSchema = mongoose.Schema(
  {
    commonBusinessActivity: {
      type: String,
      required: [true, "Please add the UBP Activity"],
      unique: [true, "UBP already exists!"],
    },
    industry: {
      type: String,
      required: [true, "Please add the industry"],
    },
    businessCategory: {
      type: String,
      required: [true, "Please add the business category"],
    },
    businessSubCategory: {
      type: String,
      required: [true, "Please add the business subcategory"],
    },
    businessActivity: {
      type: String,
      required: [true, "Please add the business activity"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("UBP", ubpSchema);
