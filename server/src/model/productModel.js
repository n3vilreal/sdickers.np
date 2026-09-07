const knex = require("../database/knex");

const create = (data) => knex("products").insert(data).returning("*");

const all = (filter = {}, sort = {}) =>
  knex("products")
    .where((builder) => {
      if (filter.product_name) {
        builder.where("product_name", "~*", filter.product_name);
      }
      if (filter.product_category) {
        builder.where("product_category", filter.product_category);
      }
      if (filter.product_price) {
        if (filter.product_price.$gte !== undefined) {
          builder.where("product_price", ">=", filter.product_price.$gte);
        }
        if (filter.product_price.$lte !== undefined) {
          builder.where("product_price", "<=", filter.product_price.$lte);
        }
      }
    })
    .modify((qb) => {
      const entries = Object.entries(sort);
      for (const [column, direction] of entries) {
        qb.orderBy(column, direction);
      }
    });

const findById = (id) => knex("products").where({ id }).first();

const related = (category, excludeId) =>
  knex("products")
    .where({ product_category: category })
    .whereNot({ id: excludeId })
    .limit(4);

const update = (id, data) =>
  knex("products").where({ id }).update({ ...data, updated_at: knex.fn.now() }).returning("*");

const remove = (id) => knex("products").where({ id }).del();

module.exports = { create, all, findById, related, update, remove };