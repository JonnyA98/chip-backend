/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("users", function (table) {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.string("email").unique().notNullable();
      table.string("password").notNullable();
      table.string("color").defaultTo("pending");
      table.string("interest_id").defaultTo("pending");
      table.string("image_url").defaultTo("pending");
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
    .createTable("interests", function (table) {
      table.increments("id").primary();
      table.string("interest").notNullable();
    })
    .createTable("user_interest", function (table) {
      table.increments("id").primary();
      table.integer("user_id").unsigned().notNullable();
      table
        .foreign("user_id")
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.integer("interest_id").unsigned().notNullable();
      table
        .foreign("interest_id")
        .references("id")
        .inTable("interests")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })

    .createTable("friendship", function (table) {
      table.increments("id").primary();
      table.integer("send_user_id").unsigned().notNullable();
      table
        .foreign("send_user_id")
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.integer("receive_user_id").unsigned().notNullable();
      table
        .foreign("receive_user_id")
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");

      table.boolean("is_friend").defaultTo(false);
      table.timestamp("friends_from").defaultTo(knex.fn.now());
    })
    .createTable("gifts", function (table) {
      table.increments("id").primary();
      table.integer("sender_id").unsigned().notNullable();
      table
        .foreign("sender_id")
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");

      table.string("title").notNullable();
      table.string("description").notNullable();
      table.integer("recipient_id").unsigned().notNullable();
      table
        .foreign("recipient_id")
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");

      table.decimal("target_money").notNullable();
      table.decimal("money_left").notNullable();
      table.timestamp("start_date").defaultTo(knex.fn.now());
      table.timestamp("end-date").notNullable;
    })
    .createTable("comments", function (table) {
      table.increments("id").primary();
      table.integer("user_id").unsigned().notNullable();
      table
        .foreign("user_id")
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");

      table.string("comment").notNullable();
      table.integer("gift_id").unsigned().notNullable();
      table
        .foreign("gift_id")
        .references("id")
        .inTable("gifts")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.timestamp("comment_time").defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTable("users")
    .dropTable("user_interest")
    .dropTable("interests")
    .dropTable("friendship")
    .dropTable("gifts")
    .dropTable("comments");
};
