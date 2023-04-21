const bcrypt = require("bcrypt");

exports.seed = async function (knex) {
  // Deletes ALL existing entries in a specific order
  await knex("chips").del();
  await knex("comments").del();
  await knex("gifts").del();
  await knex("friendship").del();
  await knex("user_interest").del();
  await knex("interests").del();
  await knex("users").del();

  // Inserts seed entries for users
  const users = await knex("users").insert([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      password: bcrypt.hashSync("password123", 10),
      color: "blue",

      image_url:
        "https://res.cloudinary.com/daiijv2mk/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1681376157/cyj4qg9igo2qxrrmzjvz.jpg",
      updated_at: new Date(),
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      password: bcrypt.hashSync("password456", 10),
      color: "green",

      image_url:
        "https://res.cloudinary.com/daiijv2mk/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1681376173/rchhqy9br0jjwxokkibj.jpg",
      updated_at: new Date(),
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      password: bcrypt.hashSync("password789", 10),
      color: "red",

      image_url:
        "https://res.cloudinary.com/daiijv2mk/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1681376182/zvwz09efbunt5lyviwyf.jpg",
      updated_at: new Date(),
    },
  ]);

  // Inserts seed entries for interests
  const interests = await knex("interests").insert([
    { id: 1, interest: "Sports" },
    { id: 2, interest: "Music" },
    { id: 3, interest: "Art" },
  ]);

  // Inserts seed entries for user_interest
  const user_interest = await knex("user_interest").insert([
    { id: 1, user_id: 1, interest_id: 1 },
    { id: 2, user_id: 2, interest_id: 2 },
    { id: 3, user_id: 3, interest_id: 3 },
  ]);

  // Inserts seed entries for friendship
  const friendship = await knex("friendship").insert([
    {
      id: 1,
      send_user_id: 1,
      receive_user_id: 2,
      is_friend: true,
      friends_from: new Date(),
    },
    {
      id: 2,
      send_user_id: 2,
      receive_user_id: 3,
      is_friend: true,
      friends_from: new Date(),
    },
  ]);

  // Inserts seed entries for gifts
  const gifts = await knex("gifts").insert([
    {
      id: 1,
      sender_id: 1,
      title: "Birthday Gift",
      description: "A gift for your birthday",
      recipient_id: 2,
      target_money: 50,
      money_left: 40,
      start_date: new Date(),
      end_date: new Date("2023-06-01"),
    },
    {
      id: 2,
      sender_id: 2,
      title: "Graduation Gift",
      description: "A gift for your graduation",
      recipient_id: 3,
      target_money: 100,
      money_left: 80,
      start_date: new Date(),
      end_date: new Date("2023-07-01"),
    },
  ]);
};
