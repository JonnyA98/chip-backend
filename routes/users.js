const knex = require("knex")(require("../knexfile"));
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password || Object.keys(req.body).length > 3) {
    return res.status(400).json({
      error: true,
      message: "Incomplete POST body",
      requiredProperties: ["name", "email", "password"],
    });
  }
  const bodyUserEmail = email;
  const userExists = await knex("users").where({ email: bodyUserEmail });

  if (userExists.length) {
    return res.status(400).json({
      error: true,
      message: "Could not add user as user as this email has been taken.",
    });
  }

  bcrypt.hash(password, 10, async (err, hashedPassword) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Couldn't encrypt the supplied password" });
    }

    try {
      await knex("users").insert({ ...req.body, password: hashedPassword });
      res.json({ success: true });
    } catch (error) {
      console.log(error);
    }
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password || Object.keys(req.body).length > 2) {
    return res.status(400).json({
      error: true,
      message: "Incomplete POST body",
      requiredProperties: ["user_name", "user_email", "user_password"],
    });
  }
  try {
    const user = await knex("users").where({ email: email }).first();

    bcrypt.compare(password, user.password, function (_, success) {
      if (!success) {
        return res
          .status(403)
          .json({ message: "Username/Password combination is incorrect" });
      }

      const token = jwt.sign(
        {
          id: user.id,
          sub: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "8h" }
      );

      res.status(200).json({ authToken: token });
    });
  } catch (error) {
    res.status(400).json({ message: "User not found" });
  }
};

const userProfile = async (req, res) => {
  try {
    const user = await knex("users").where({ id: req.token.id }).first();

    delete user.password;

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Can't fetch user profile" });
  }
};

// module.exports = signup;
// module.exports = login;
// module.exports = userProfile;

module.exports = {
  signup,
  login,
  userProfile,
};
