const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/UBPDb");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

connectDb();

app.use(cors());
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use("/api/naics", require("./routes/UBPRoutes"));
app.use(errorHandler);
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
