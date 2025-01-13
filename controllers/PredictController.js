// MongoDB Atlas connection
const { MongoClient } = require("mongodb");
const asyncHandler = require("express-async-handler");
const uri = process.env.MONGO_URI; // MongoDB Atlas connection string
const client = new MongoClient(uri);
const dbName = "ubp"; // MongoDB database name
const collectionName = "ubps"; // MongoDB collection name

// MongoDB connection management
let isMongoConnected = false;

const connectToMongo = async () => {
  if (isMongoConnected) {
    return;
  }

  try {
    await client.connect();
    isMongoConnected = true;
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw new Error("Failed to connect to MongoDB Atlas");
  }
};

// @desc Predict business activities based on query
// @route POST /api/predict
// @access Public
const makePrediction = asyncHandler(async (req, res) => {
    const { query } = req.body;
  
    if (!query || typeof query !== "string" || query.trim() === "") {
      res.status(400);
      throw new Error("Invalid or missing query parameter.");
    }
  
    try {
      // Ensure MongoDB is connected
      await connectToMongo();
  
      const db = client.db(dbName);
      const collection = db.collection(collectionName);
  
      // MongoDB Atlas Full-Text Search using $search to suggest predictions
      const predictions = await collection
        .aggregate([
          {
            $search: {
              index: "commonbusinessactivity", // Specify your search index
              text: {
                query: query,
                path: ["commonBusinessActivity", "businessActivity"], // Fields to predict
              },
            },
          },
          { $limit: 20 }, // Limit predictions to 20 items
          { $project: { commonBusinessActivity: 1 } }, // Only return the activity name
        ])
        .toArray();
  
      if (predictions.length === 0) {
        res.status(404);
        throw new Error("No predictions found. Try refining your query.");
      }
  
      // Map the predictions to their business activities
      const predictionList = predictions.map((item) => item.commonBusinessActivity);
  
      res.status(200).json({ predictions: predictionList });
    } catch (error) {
      res.status(500);
      throw new Error(
        "An error occurred while processing your prediction request. Please try again later."
      );
    }
  });
  
module.exports = { makePrediction };
  