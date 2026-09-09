exports.up = async function (knex) {
  await knex.schema.createTable("packs", (table) => {
    table.increments("id").primary();
    table.string("pack_name").notNullable();
    table.text("pack_description").notNullable();
    table.string("pack_image").defaultTo("");
    table.decimal("pack_price").notNullable();
    table.integer("pack_stock_qty").notNullable();
    table.enu("pack_status", ["available", "unavailable"]).defaultTo("available");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("pack_items", (table) => {
    table.increments("id").primary();
    table.integer("pack_id").notNullable().references("id").inTable("packs").onDelete("CASCADE");
    table.integer("product_id").notNullable().references("id").inTable("products").onDelete("CASCADE");
    table.unique(["pack_id", "product_id"]);
  });

  await knex.schema.createTable("reviews", (table) => {
    table.increments("id").primary();
    table.integer("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.integer("stars").notNullable();
    table.text("review_text").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });

  await knex.schema.alterTable("cart_items", (table) => {
    table.dropUnique(["cart_id", "product_id"]);
    table.integer("product_id").nullable().alter();
    table.integer("pack_id").references("id").inTable("packs").onDelete("CASCADE");
    table.unique(["cart_id", "pack_id"]);
    table.unique(["cart_id", "product_id"]);
  });

  await knex.schema.alterTable("order_items", (table) => {
    table.integer("product_id").nullable().alter();
    table.integer("pack_id").references("id").inTable("packs").onDelete("CASCADE");
  });
};

exports.down = async function (knex) {
  await knex.schema.alterTable("order_items", (table) => {
    table.dropColumn("pack_id");
    table.integer("product_id").notNullable().alter();
  });
  await knex.schema.alterTable("cart_items", (table) => {
    table.dropUnique(["cart_id", "pack_id"]);
    table.dropUnique(["cart_id", "product_id"]);
    table.dropColumn("pack_id");
    table.integer("product_id").notNullable().alter();
    table.unique(["cart_id", "product_id"]);
  });
  await knex.schema.dropTableIfExists("reviews");
  await knex.schema.dropTableIfExists("pack_items");
  await knex.schema.dropTableIfExists("packs");
};
