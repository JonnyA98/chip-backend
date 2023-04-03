const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const passport = require("passport");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const bycrypt = require("bcrypt");
const { signup } = require("./routes/users");
const { login } = require("./routes/users");
const { userProfile } = require("./routes/users");
const { users } = require("./routes/users");
const { friendRequest } = require("./routes/users");
const authorise = require("./auth");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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
  })
);

app.post("/api/users", signup);
app.post("/api/user", login);
app.get("/api/user", authorise, userProfile);
app.get("/api/users/non-friends/:id", users);
app.post("/api/users/friend-request", friendRequest);

if (!process.env.BACKEND_PORT) {
  process.env.BACKEND_PORT === 3001;
}
app.listen(process.env.BACKEND_PORT, () => {
  console.log("Server started on port 3001");
});
