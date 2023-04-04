const knex = require("knex")(require("../knexfile"));
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//SENDS A POST REQUEST TO CREATE A NEW ACCOUNT
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
//SENDS A POST REQUEST TO GET A JWT WHEN USER ENTERS THEIR LOGIN DETAILS
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
//GETS USER PROFILE USING JWT
const userProfile = async (req, res) => {
  try {
    const user = await knex("users").where({ id: req.token.id }).first();

    delete user.password;

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Can't fetch user profile" });
  }
};

//GET ALL USERS NOT INCLUDING CURRENT USERID
const users = async (req, res) => {
  const userId = req.params.id;

  try {
    const users = await knex("users").whereNot({ id: userId });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Can't fetch users" });
  }
};

//MAKE POST REQUEST TO SEND FRIEND REQUEST

const friendRequest = async (req, res) => {
  const { send_user_id, receive_user_id } = req.body;
  if (!send_user_id || !receive_user_id) {
    return res.status(400).json({
      error: true,
      message: "Incomplete POST body",
      requiredProperties: ["send_user_id", "receive_user_id"],
    });
  }

  const sendUserExists = await knex("users").where({ id: send_user_id });
  const receiveUserExists = await knex("users").where({ id: receive_user_id });

  if (!sendUserExists.length || !receiveUserExists.length) {
    return res.status(400).json({
      error: true,
      message: "Could not add friends as user/users do not exist",
    });
  }

  try {
    await knex("friendship").insert({ ...req.body });
    res.json({ success: true });
  } catch (error) {
    console.log(error);
  }
};

//SHOW ALL PENDING FRIEND REQUESTS

const pendingFriendRequests = async function (req, res) {
  const userId = req.params.id;

  try {
    const pendingRequests = await knex("friendship").select().where({
      receive_user_id: userId,
      is_friend: false,
    });

    res.status(200).json(pendingRequests);
  } catch (error) {
    res.status(500).json({ message: "Can't fetch pending friend requests" });
  }
};

//ACCEPT A FRIEND REQUEST

const acceptFriendRequest = async function (req, res) {
  const friendRequestId = req.params.id;

  try {
    const friendRequest = await knex("friendship")
      .where({ id: friendRequestId, is_friend: false })
      .first();

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    await knex("friendship")
      .where({ id: friendRequestId })
      .update({ is_friend: true });

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Can't update friendship request" });
  }
};

//GET A USER'S FRIEND LIST
const friends = async function (req, res) {
  const userId = req.params.id;

  try {
    const friends = await knex
      .select("u.*")
      .from("users as u")
      .join("friendship as f", function () {
        this.on("u.id", "=", "f.send_user_id").orOn(
          "u.id",
          "=",
          "f.receive_user_id"
        );
      })
      .where(function () {
        this.where("f.send_user_id", userId).orWhere(
          "f.receive_user_id",
          userId
        );
      })
      .whereNot("u.id", userId)
      .where("f.is_friend", true);

    res.json(friends);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

module.exports = {
  signup,
  login,
  userProfile,
  users,
  friendRequest,
  pendingFriendRequests,
  acceptFriendRequest,
  friends,
};
