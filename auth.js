require("dotenv").config();
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware which checks the JWT token the user provided
const authorise = (req, res, next) => {
  // If the client didn't send an `authorisation` token, they are unauthorised
  if (!req.headers.authorisation) {
    return res
      .status(401)
      .json({ message: "This route requires an authentication token" });
  }

  // The client will send the JWT token as part of the `authorisation` header like so "Bearer ABC123"
  // So split that string by a space and get the JWT token (the second part)
  const token = req.headers.authorisation.split(" ")[1];

  // Check the provided JWT is correct for the given user
  jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
    if (err) {
      return res
        .status(401)
        .json({ message: "The authentication token is invalid" });
    }

    // Attach the decoded JWT on the request, so that it can be used on the /profile endpoint
    req.token = decodedToken;

    // Move on to the next request
    next();
  });
};

module.exports = authorise;
