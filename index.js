const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const uploadImage = require("./uploadimg");
const authorise = require("./auth");
const expressSession = require("express-session");
const {
  signup,
  login,
  userProfile,
  nonUserProfile,
  users,
  friendRequest,
  pendingFriendRequests,
  acceptFriendRequest,
  friends,
  allUsers,
  updateUser,
  interests,
} = require("./routes/users");

const app = express();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(
  expressSession({
    secret: process.env.SERVER_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    exposedHeaders: ["Access-Control-Allow-Origin"],
  })
);

app.post("/api/users", signup);
app.post("/api/user", login);
app.get("/api/user", authorise, userProfile);
app.get("/api/non-user/:id", nonUserProfile);
app.get("/api/users/:id", users);
app.post("/api/users/friend-request", friendRequest);
app.get("/api/users/friend-requests/:id", pendingFriendRequests);
app.patch("/api/users/friend-accept/:id", acceptFriendRequest);
app.get("/api/users/friends/:id", friends);
app.get("/api/users/all", allUsers);
app.put("/api/users/update", authorise, updateUser);
app.get("/api/users/interests/:id", interests);
app.post("/api/uploadimage", (req, res) => {
  uploadImage(req.body.image)
    .then((url) => res.send(url))
    .catch((err) => res.status(500).send(err));
});

if (!process.env.BACKEND_PORT) {
  process.env.BACKEND_PORT === 3001;
}
app.listen(process.env.BACKEND_PORT, () => {
  console.log("Server started on port 3001");
});
