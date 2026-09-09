const knex = require("../database/knex");

const createPack = (data, productIds) =>
  knex.transaction(async (trx) => {
    const [pack] = await trx("packs").insert(data).returning("*");
    if (productIds && productIds.length) {
      await trx("pack_items").insert(
        productIds.map((productId) => ({ pack_id: pack.id, product_id: productId }))
      );
    }
    return pack;
  });

const all = (filter = {}) =>
  knex("packs")
    .where((builder) => {
      if (filter.pack_name) {
        builder.where("pack_name", "~*", filter.pack_name);
      }
      if (filter.pack_status) {
        builder.where("pack_status", filter.pack_status);
      }
    })
    .orderBy("created_at", "desc");

const findById = (id) => knex("packs").where({ id }).first();

const findItemIds = (packId) =>
  knex("pack_items").where({ pack_id: packId }).pluck("product_id");

const updatePack = (id, data, productIds) =>
  knex.transaction(async (trx) => {
    const [pack] = await trx("packs")
      .where({ id })
      .update({ ...data, updated_at: trx.fn.now() })
      .returning("*");
    if (!pack) return null;
    if (productIds) {
      await trx("pack_items").where({ pack_id: id }).del();
      if (productIds.length) {
        await trx("pack_items").insert(
          productIds.map((productId) => ({ pack_id: id, product_id: productId }))
        );
      }
    }
    return pack;
  });

const removePack = (id) => knex("packs").where({ id }).del();

module.exports = { createPack, all, findById, findItemIds, updatePack, removePack };
