const mongoose = require("mongoose");

const businessActivitySchema = mongoose.Schema(
  {
    businessActivity: {
      type: String,
      required: [true, "Please add the business sub category"],
    },
    businessActivityCode: {
      type: String,
      required: [true, "Please add the business subcategory code"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("BusinessActivity", businessActivitySchema);
