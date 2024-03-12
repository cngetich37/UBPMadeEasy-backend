const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/UBPDb");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

connectDb();
app.use(express.json());

// Middleware
app.use(bodyParser.json());

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/naics", require("./routes/UBPRoutes"));
app.use(errorHandler);
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
