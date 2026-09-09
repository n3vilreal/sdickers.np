const knex = require("../../../database/knex");
const Pack = require("../../../model/packModel");

const shapePack = (pack, products) => ({
  _id: pack.id,
  id: pack.id,
  packName: pack.pack_name,
  packDescription: pack.pack_description,
  packImage: pack.pack_image,
  packPrice: Number(pack.pack_price),
  packStockQty: pack.pack_stock_qty,
  packStatus: pack.pack_status,
  packProducts: products
    ? products.map((p) => ({
        _id: p.id,
        id: p.id,
        productName: p.product_name,
        productDescription: p.product_description,
        productImage: p.product_image,
        productStockQty: p.product_stock_qty,
        productPrice: Number(p.product_price),
        productStatus: p.product_status,
        productCategory: p.product_category,
      }))
    : undefined,
  createdAt: pack.created_at,
  updatedAt: pack.updated_at,
});

const attachProducts = async (packs) => {
  const itemRows = await Promise.all(packs.map((p) => Pack.findItemIds(p.id)));
  const productIds = [...new Set(itemRows.flat())];
  const products = productIds.length
    ? await knex("products").whereIn("id", productIds)
    : [];
  const productMap = Object.fromEntries(products.map((p) => [p.id, p]));
  return packs.map((pack, i) =>
    shapePack(
      pack,
      itemRows[i]
        .map((id) => productMap[id])
        .filter(Boolean)
    )
  );
};

exports.getAllPacks = async (req, res) => {
  try {
    const { search } = req.query;
    const filter = {};
    if (search) filter.pack_name = search;
    const rows = await Pack.all(filter);
    const data = await attachProducts(rows);
    res.status(200).json({ message: "Packs fetched successfully", total: data.length, data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSinglePack = async (req, res) => {
  try {
    const pack = await Pack.findById(req.params.id);
    if (!pack) return res.status(404).json({ message: "Pack not found" });
    const [shaped] = await attachProducts([pack]);
    res.status(200).json({ data: shaped });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPack = async (req, res) => {
  try {
    const { packName, packDescription, packPrice, packStatus, packStockQty, packImage, productIds } = req.body;
    if (
      !packName ||
      !packDescription ||
      packPrice === undefined ||
      packPrice === null ||
      packPrice === "" ||
      packStockQty === undefined ||
      packStockQty === null ||
      packStockQty === "" ||
      !productIds ||
      productIds.length === 0
    ) {
      return res.status(400).json({ message: "Please provide pack name, description, price, stock and at least one sticker" });
    }
    const pack = await Pack.createPack(
      {
        pack_name: packName,
        pack_description: packDescription,
        pack_price: packPrice,
        pack_status: packStatus || "available",
        pack_stock_qty: packStockQty,
        pack_image: packImage,
      },
      productIds
    );
    const [shaped] = await attachProducts([pack]);
    res.status(201).json({ message: "Pack created successfully", data: shaped });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePack = async (req, res) => {
  try {
    const existing = await Pack.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Pack not found" });
    const body = req.body || {};
    const patch = {};
    if (body.packName !== undefined) patch.pack_name = body.packName;
    if (body.packDescription !== undefined) patch.pack_description = body.packDescription;
    if (body.packPrice !== undefined) patch.pack_price = body.packPrice;
    if (body.packStatus !== undefined) patch.pack_status = body.packStatus;
    if (body.packStockQty !== undefined) patch.pack_stock_qty = body.packStockQty;
    if (body.packImage !== undefined) patch.pack_image = body.packImage;
    const updated = await Pack.updatePack(req.params.id, patch, body.productIds);
    const [shaped] = await attachProducts([updated]);
    res.status(200).json({ message: "Pack updated successfully", data: shaped });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePack = async (req, res) => {
  try {
    const deleted = await Pack.removePack(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Pack not found" });
    res.status(200).json({ message: "Pack deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
