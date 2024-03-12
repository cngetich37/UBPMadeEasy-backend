const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

// Middleware
app.use(bodyParser.json());

// Endpoint to handle NAICS code
app.post("/naics", (req, res) => {
  const { commonBusiness, naicsCode } = req.body;

  if (!naicsCode || !commonBusiness) {
    return res
      .status(400)
      .json({ error: "NAICS code & CommonBusiness Activity are required" });
  }

  // Validate that the NAICS code is a string
  if (typeof naicsCode !== "string") {
    return res.status(400).json({ error: "NAICS code must be a string" });
  }

  // Break NAICS code into four categories
  const naicsCategories = {
    commonBusinessActivity: commonBusiness,
    industry: naicsCode.substring(0, 2),
    businessCategory: naicsCode.substring(0, 3),
    businessSubCategory: naicsCode.substring(0, 4),
    businessActivity: naicsCode.substring(0, 5),
  };

  // Respond with naicsCategories
  res.json(naicsCategories);
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
