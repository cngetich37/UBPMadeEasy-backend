const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validToken = asyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(401);
        throw new Error("User is not authorized");
      }
      req.user = decoded.user;

      next();
    });

    const decodedToken = jwt.decode(token);
    const expirationTime = decodedToken.exp;
    console.log(
      "Token expiration Time is:",
      new Date(expirationTime * 1000).toISOString()
    );

    if (!token) {
      res.status(401);
      throw new Error("User is not authorized or token is missing!");
    }
  }
});

module.exports = validToken;
