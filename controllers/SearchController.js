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
    // console.log("Connected to MongoDB Atlas");
  } catch (error) {
    // console.error("MongoDB connection failed:", error);
    throw new Error("Failed to connect to MongoDB Atlas");
  }
};

// @desc Search for business activities by query
// @route POST /api/search
// @access Public
const doSearch = asyncHandler(async (req, res) => {
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
  
      // Escape special characters in the query for regex
      const escapedQuery = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  
      // Use a regex to match the exact query (case-insensitive)
      const regexQuery = new RegExp(`^${escapedQuery}$`, "i");
  
      const results = await collection
        .find({
          $or: [
            { commonBusinessActivity: { $regex: regexQuery } },
            { businessActivity: { $regex: regexQuery } },
          ],
        })
        .limit(10)
        .toArray();
  
      // Check if any results were found
      if (results.length === 0) {
        res.status(404);
        throw new Error("No results found for your query. Please try with a different term.");
      }
  
      // Send the search results to the client
      res.status(200).json({ results });
    } catch (error) {
      res.status(500);
      throw new Error("An error occurred while processing your request.");
    }
  });
  
    module.exports = { doSearch };
  