const knex = require("knex")(require("../knexfile"));

//SENDS POST REQUEST TO CREATE A NEW GIFT

const createGift = async (req, res) => {
  const {
    sender_id,
    title,
    description,
    recipient_id,
    target_money,
    money_left,
    end_date,
  } = req.body;

  if (
    !sender_id ||
    !title ||
    !description ||
    !recipient_id ||
    !target_money ||
    !money_left ||
    !end_date
  ) {
    return res.status(400).json({
      error: true,
      message: "Incomplete POST body",
      requiredProperties: [
        "sender_id",
        "title",
        "description",
        "recipient_id",
        "target_money",
        "money_left",
        "end_date",
      ],
    });
  }
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
        this.where("f.send_user_id", sender_id).orWhere(
          "f.receive_user_id",
          sender_id
        );
      })
      .whereNot("u.id", sender_id)
      .where("f.is_friend", true);

    const friendIds = friends.map((friend) => friend.id);
    if (!friendIds.includes(parseInt(recipient_id))) {
      return res.status(400).json({
        error: true,
        message: "Cannot send a gift to someone sender is not friends with!",
      });
    }

    await knex("gifts").insert({ ...req.body });
    res.json({ success: true });
  } catch (error) {
    console.log(error);
  }
};

//GET A LIST OF GIFTS FOR A PARTICULAR USER AS RECIEVER
const recieverGifts = async (req, res) => {
  recipientId = req.params.id;

  //   if (req.token.id === userId) {
  //     return res
  //       .status(401)
  //       .json({ error: true, message: "You can't see your own gifts!" });
  //   }

  try {
    const gifts = await knex("gifts").where({ recipient_id: recipientId });
    res.json(gifts);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: true, message: "Server error couldn't fetch gifts" });
  }
};

//CHIP
const chip = async (req, res) => {
  const { user_id, gift_id, chip_amount } = req.body;
  if (!user_id || !gift_id || !chip_amount) {
    return res.status(400).json({
      error: true,
      message: "Incomplete POST body",
      requiredProperties: ["user_id", "gift_id", "chip_amount"],
    });
  }

  try {
    await knex("chips").insert({ ...req.body });
    res.json({ Success: true });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

//EDIT GIFT AFTER CHIP
const editGift = async (req, res) => {
  const { gift_id, chip_amount } = req.body;
  if (!gift_id || !chip_amount) {
    return res.status(400).json({
      error: true,
      message: "Incomplete POST body",
      requiredProperties: ["gift_id", "chip_amount"],
    });
  }

  try {
    gift = await knex("gifts").where({ id: gift_id }).first();
    console.log(gift);
    console.log(typeof gift.money_left, typeof chip_amount);
    newMoneyLeft = parseFloat(gift.money_left) - parseFloat(chip_amount);
    console.log(newMoneyLeft);
    await knex("gifts")
      .where({ id: gift_id })
      .update({ money_left: newMoneyLeft });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports = {
  createGift,
  recieverGifts,
  chip,
  editGift,
};
