exports.up = async function (knex) {
  await knex.schema.createTable("payment_settings", (table) => {
    table.increments("id").primary();
    table.string("method").notNullable().unique();
    table.string("qr_image").defaultTo("");
    table.string("account_name").defaultTo("");
    table.string("account_number").defaultTo("");
    table.text("instructions");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
  await knex("payment_settings").insert([
    { method: "eSewa" },
    { method: "Khalti" },
  ]);
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("payment_settings");
};
