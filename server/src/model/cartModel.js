const knex = require("../database/knex");

const getOrCreateCart = async (userId) => {
  let cart = await knex("carts").where({ user_id: userId }).first();
  if (!cart) {
    const [row] = await knex("carts").insert({ user_id: userId }).returning("id");
    cart = { id: row.id, user_id: userId };
  }
  return cart;
};

const findItem = (cartId, productId) =>
  knex("cart_items").where({ cart_id: cartId, product_id: productId }).first();

const findPackItem = (cartId, packId) =>
  knex("cart_items").where({ cart_id: cartId, pack_id: packId }).first();

const addItem = (cartId, payload) =>
  knex("cart_items").insert(payload).returning("*");

const bumpItem = (cartId, productId, quantity) =>
  knex("cart_items").where({ cart_id: cartId, product_id: productId }).update({ quantity }).returning("*");

const bumpPackItem = (cartId, packId, quantity) =>
  knex("cart_items").where({ cart_id: cartId, pack_id: packId }).update({ quantity }).returning("*");

const shapeCartProduct = (p) => ({
  _id: p.id,
  id: p.id,
  productName: p.product_name,
  productDescription: p.product_description,
  productImage: p.product_image,
  productStockQty: p.product_stock_qty,
  productPrice: Number(p.product_price),
  productStatus: p.product_status,
  productCategory: p.product_category,
});

const shapeCartPack = (p) => ({
  _id: p.id,
  id: p.id,
  packName: p.pack_name,
  packDescription: p.pack_description,
  packImage: p.pack_image,
  packPrice: Number(p.pack_price),
  packStockQty: p.pack_stock_qty,
  packStatus: p.pack_status,
});

const getCartWithItems = (userId) =>
  knex("carts").where({ user_id: userId }).first().then(async (cart) => {
    if (!cart) return { items: [] };
    const items = await knex("cart_items")
      .where({ cart_id: cart.id })
      .select("id", "product_id", "pack_id", "quantity");
    const productIds = items.map((i) => i.product_id).filter(Boolean);
    const packIds = items.map((i) => i.pack_id).filter(Boolean);
    const products = productIds.length
      ? await knex("products").whereIn("id", productIds)
      : [];
    const packs = packIds.length
      ? await knex("packs").whereIn("id", packIds)
      : [];
    const productMap = Object.fromEntries(products.map((p) => [p.id, p]));
    const packMap = Object.fromEntries(packs.map((p) => [p.id, p]));
    return {
      ...cart,
      items: items.map((i) => ({
        id: i.id,
        product: i.product_id ? (productMap[i.product_id] ? shapeCartProduct(productMap[i.product_id]) : null) : null,
        pack: i.pack_id ? (packMap[i.pack_id] ? shapeCartPack(packMap[i.pack_id]) : null) : null,
        quantity: i.quantity,
      })),
    };
  });

const updateItem = (cartId, productId, quantity) =>
  knex("cart_items").where({ cart_id: cartId, product_id: productId }).update({ quantity }).returning("*");

const updatePackItem = (cartId, packId, quantity) =>
  knex("cart_items").where({ cart_id: cartId, pack_id: packId }).update({ quantity }).returning("*");

const removeItem = (cartId, productId) =>
  knex("cart_items").where({ cart_id: cartId, product_id: productId }).del();

const removePackItem = (cartId, packId) =>
  knex("cart_items").where({ cart_id: cartId, pack_id: packId }).del();

const clear = (cartId) => knex("cart_items").where({ cart_id: cartId }).del();

const findByProduct = (cartId, productId) =>
  knex("cart_items").where({ cart_id: cartId, product_id: productId }).first();

const findByPack = (cartId, packId) =>
  knex("cart_items").where({ cart_id: cartId, pack_id: packId }).first();

module.exports = {
  getOrCreateCart,
  findItem,
  findPackItem,
  addItem,
  bumpItem,
  bumpPackItem,
  getCartWithItems,
  updateItem,
  updatePackItem,
  removeItem,
  removePackItem,
  clear,
  findByProduct,
  findByPack,
};
