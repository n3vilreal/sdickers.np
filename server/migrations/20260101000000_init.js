exports.up = async function (knex) {
  await knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("user_email").notNullable().unique();
    table.string("user_phone_number").notNullable();
    table.string("user_name").notNullable();
    table.string("user_password").notNullable();
    table.enu("role", ["customer", "admin"]).defaultTo("customer");
    table.string("otp");
    table.boolean("is_otp_verified").defaultTo(false);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("products", (table) => {
    table.increments("id").primary();
    table.string("product_name").notNullable();
    table.text("product_description").notNullable();
    table.string("product_image").defaultTo("");
    table.integer("product_stock_qty").notNullable();
    table.decimal("product_price").notNullable();
    table.enu("product_status", ["available", "unavailable"]).defaultTo("available");
    table.string("product_category").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("carts", (table) => {
    table.increments("id").primary();
    table.integer("user_id").notNullable().unique().references("id").inTable("users").onDelete("CASCADE");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("cart_items", (table) => {
    table.increments("id").primary();
    table.integer("cart_id").notNullable().references("id").inTable("carts").onDelete("CASCADE");
    table.integer("product_id").notNullable().references("id").inTable("products").onDelete("CASCADE");
    table.integer("quantity").notNullable().defaultTo(1);
    table.unique(["cart_id", "product_id"]);
  });

  await knex.schema.createTable("orders", (table) => {
    table.increments("id").primary();
    table.integer("user_id").references("id").inTable("users").onDelete("SET NULL");
    table.string("customer_name").notNullable();
    table.string("customer_phone").notNullable();
    table.string("customer_email");
    table.text("delivery_address").notNullable();
    table.decimal("total_amount").notNullable();
    table.enu("payment_method", ["Cash on Delivery", "eSewa", "Khalti"]).defaultTo("Cash on Delivery");
    table.enu("order_status", [
      "Pending",
      "Confirmed",
      "Packed",
      "Shipped",
      "Delivered",
      "Cancelled",
    ]).defaultTo("Pending");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("order_items", (table) => {
    table.increments("id").primary();
    table.integer("order_id").notNullable().references("id").inTable("orders").onDelete("CASCADE");
    table.integer("product_id").notNullable().references("id").inTable("products");
    table.integer("quantity").notNullable();
    table.decimal("price").notNullable();
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("order_items");
  await knex.schema.dropTableIfExists("orders");
  await knex.schema.dropTableIfExists("cart_items");
  await knex.schema.dropTableIfExists("carts");
  await knex.schema.dropTableIfExists("products");
  await knex.schema.dropTableIfExists("users");
};