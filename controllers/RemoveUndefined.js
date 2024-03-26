const asyncHandler = require("express-async-handler"); // Assuming you are using express-async-handler
const FinanceAct = require("../models/FinanceActModel"); // Assuming you have a model defined for FinanceAct

const UBPFinancaAct_One = asyncHandler(async (req, res) => {
  try {
    // Fetch finance act data from the database
    const ubpFinance = await FinanceAct.find();

    // Update any occurrences of "undefined" in the fetched data
    ubpFinance.map((item) => {
      // Replace "undefined" with "0" for each relevant field
      return {
        ...item.toObject(),
        foodHygiene: item.foodHygiene === undefined ? "0" : item.foodHygiene,
        healthCertificate:
          item.healthCertificate === undefined ? "0" : item.healthCertificate,
        // Add more fields to update if needed
      };
    });

    // Send the updated financial data as a JSON response
    res.status(200).json({ message: "Updated successfully" });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = UBPFinancaAct_One;
