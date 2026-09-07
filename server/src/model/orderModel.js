const knex = require("../database/knex");

const create = async (data, items) => {
  return knex.transaction(async (trx) => {
    const [order] = await trx("orders").insert(data).returning("*");
    if (items && items.length) {
      const rows = items.map((it) => ({
        order_id: order.id,
        product_id: it.product,
        quantity: it.quantity,
        price: it.price,
      }));
      await trx("order_items").insert(rows);
    }
    return order;
  });
};

const findMyOrders = (userId) =>
  knex("orders").where({ user_id: userId }).orderBy("created_at", "desc");

const findAll = () => knex("orders").orderBy("created_at", "desc");

const findById = (id) => knex("orders").where({ id }).first();

const findItemsByOrder = (orderId) =>
  knex("order_items").where({ order_id: orderId });

const findByPhoneAndUser = (userId, phone) =>
  knex("orders").where({ user_id: userId, customer_phone: phone });

const updateStatus = (id, status) =>
  knex("orders").where({ id }).update({ order_status: status, updated_at: knex.fn.now() }).returning("*");

const remove = (id) => knex("orders").where({ id }).del();

const getProductsByIds = (ids) =>
  ids.length ? knex("products").whereIn("id", ids) : Promise.resolve([]);

module.exports = {
  create,
  findMyOrders,
  findAll,
  findById,
  findItemsByOrder,
  findByPhoneAndUser,
  updateStatus,
  remove,
  getProductsByIds,
};