const knex = require("../database/knex");

const METHODS = ["eSewa", "Khalti"];

const findByMethod = (method) =>
  knex("payment_settings").where({ method }).first();

const findAll = () => knex("payment_settings").orderBy("id", "asc");

const update = (method, data) =>
  knex("payment_settings")
    .where({ method })
    .update({ ...data, updated_at: knex.fn.now() })
    .returning("*");

module.exports = { findByMethod, findAll, update, METHODS };
