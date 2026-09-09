const Cart = require("../../model/cartModel");

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, packId, quantity } = req.body;
    if (!productId && !packId) {
      return res.status(400).json({ message: "Product ID or Pack ID is required" });
    }
    const cart = await Cart.getOrCreateCart(userId);
    if (packId) {
      const existing = await Cart.findPackItem(cart.id, packId);
      if (existing) {
        await Cart.bumpPackItem(cart.id, packId, (existing.quantity || 0) + (quantity || 1));
      } else {
        await Cart.addItem(cart.id, { cart_id: cart.id, pack_id: packId, quantity: quantity || 1 });
      }
    } else {
      const existing = await Cart.findItem(cart.id, productId);
      if (existing) {
        await Cart.bumpItem(cart.id, productId, (existing.quantity || 0) + (quantity || 1));
      } else {
        await Cart.addItem(cart.id, { cart_id: cart.id, product_id: productId, quantity: quantity || 1 });
      }
    }
    const data = await Cart.getCartWithItems(userId);
    res.status(200).json({ message: "Added to cart", data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const data = await Cart.getCartWithItems(req.user.id);
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const { quantity } = req.body;
    const packId = req.params.packId || req.body.packId;
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity should be greater than 0" });
    }
    const cart = await Cart.getOrCreateCart(req.user.id);
    if (packId) {
      const existing = await Cart.findByPack(cart.id, packId);
      if (!existing) {
        return res.status(404).json({ message: "Pack not found in cart" });
      }
      await Cart.updatePackItem(cart.id, packId, quantity);
    } else {
      const existing = await Cart.findByProduct(cart.id, req.params.productId);
      if (!existing) {
        return res.status(404).json({ message: "Product not found in cart" });
      }
      await Cart.updateItem(cart.id, req.params.productId, quantity);
    }
    const data = await Cart.getCartWithItems(req.user.id);
    res.status(200).json({ message: "Cart updated successfully", data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.getOrCreateCart(req.user.id);
    if (req.params.packId) {
      await Cart.removePackItem(cart.id, req.params.packId);
    } else {
      await Cart.removeItem(cart.id, req.params.productId);
    }
    const data = await Cart.getCartWithItems(req.user.id);
    res.status(200).json({ message: "Removed from cart", data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.getOrCreateCart(req.user.id);
    await Cart.clear(cart.id);
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
