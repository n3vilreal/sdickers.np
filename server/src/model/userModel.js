const knex = require("../database/knex");

const findByEmail = (email) => knex("users").where({ user_email: email });

const findById = (id) => knex("users").where({ id }).first();

const create = (data) => knex("users").insert(data).returning("*");

const update = (id, data) =>
  knex("users").where({ id }).update(data).returning("*");

const remove = (id) => knex("users").where({ id }).del();

const all = () =>
  knex("users")
    .select("id", "user_email", "user_phone_number", "user_name", "role", "is_otp_verified", "created_at", "updated_at")
    .orderBy("id", "desc");

module.exports = { findByEmail, findById, create, update, remove, all };