const Product = require("../../../model/productModel");

const shapeProduct = (p) => ({
  _id: p.id,
  id: p.id,
  productName: p.product_name,
  productDescription: p.product_description,
  productImage: p.product_image,
  productStockQty: p.product_stock_qty,
  productPrice: Number(p.product_price),
  productStatus: p.product_status,
  productCategory: p.product_category,
  createdAt: p.created_at,
  updatedAt: p.updated_at,
});

exports.createProduct = async (req, res) => {
  try {
    const {
      productName,
      productDescription,
      productPrice,
      productStatus,
      productStockQty,
      productCategory,
      productImage,
    } = req.body;
    if (
      !productName ||
      !productDescription ||
      !productPrice ||
      !productStockQty ||
      !productCategory
    ) {
      return res.status(400).json({ message: "Please provide all the details" });
    }
    await Product.create({
      product_name: productName,
      product_description: productDescription,
      product_price: productPrice,
      product_status: productStatus || "available",
      product_stock_qty: productStockQty,
      product_category: productCategory,
      product_image: productImage,
    });
    res.status(201).json({ message: "Product created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort } = req.query;
    const filter = {};
    if (search) {
      filter.product_name = search;
    }
    if (category) {
      filter.product_category = category;
    }
    if (minPrice || maxPrice) {
      filter.product_price = {};
      if (minPrice) filter.product_price.$gte = Number(minPrice);
      if (maxPrice) filter.product_price.$lte = Number(maxPrice);
    }
    const sortOption = {};
    if (sort === "latest") sortOption.created_at = "desc";
    if (sort === "priceAsc") sortOption.product_price = "asc";
    if (sort === "priceDesc") sortOption.product_price = "desc";
    const rows = await Product.all(filter, sortOption);
    const data = rows.map(shapeProduct);
    res.status(200).json({ message: "Products fetched successfully", total: data.length, data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSingleProduct = async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ data: shapeProduct(p) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    const rows = await Product.related(product.product_category, product.id);
    res.status(200).json({ data: rows.map(shapeProduct) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const existing = await Product.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Product not found" });
    const body = req.body || {};
    const patch = {};
    if (body.productName !== undefined) patch.product_name = body.productName;
    if (body.productDescription !== undefined) patch.product_description = body.productDescription;
    if (body.productPrice !== undefined) patch.product_price = body.productPrice;
    if (body.productStatus !== undefined) patch.product_status = body.productStatus;
    if (body.productStockQty !== undefined) patch.product_stock_qty = body.productStockQty;
    if (body.productCategory !== undefined) patch.product_category = body.productCategory;
    if (body.productImage !== undefined) patch.product_image = body.productImage;
    const [updated] = await Product.update(req.params.id, patch);
    res.status(200).json({ message: "Product updated successfully", data: shapeProduct(updated) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.remove(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};