const mongoose = require("mongoose");

const businessActivitySchema = mongoose.Schema(
  {
    businessActivity: {
      type: String,
      required: [true, "Please add the business activity"],
    },
    businessActivityCode: {
      type: String,
      required: [true, "Please add the business activity code"],
    },
    businessTradeCode: {
      type: String,
      required: [true, "Please add the business trade code"],
    },
    financeActs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FinanceAct' }]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("BusinessActivity", businessActivitySchema);
