const mongoose = require("mongoose");

const industrySchema = mongoose.Schema(
  {
    industry: {
      type: String,
      required: [true, "Please add the industry"],
    },
    industryCode: {
      type: String,
      required: [true, "Please add the industry code"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Industry", industrySchema);
