const mongoose = require("mongoose");

const businessCategorySchema = mongoose.Schema(
  {
    businessCategory: {
      type: String,
      required: [true, "Please add the business category"],
    },
    businessCategoryCode: {
      type: String,
      required: [true, "Please add the business category code"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("BusinessCategory", businessCategorySchema);
