const Order = require("../../model/orderModel");

const shapeOrder = async (o) => {
  const items = await Order.findItemsByOrder(o.id);
  const productIds = items.map((i) => i.product_id).filter(Boolean);
  const packIds = items.map((i) => i.pack_id).filter(Boolean);
  const products = await Order.getProductsByIds(productIds);
  const packs = await Order.getPacksByIds(packIds);
  const pMap = Object.fromEntries(products.map((p) => [p.id, p]));
  const packMap = Object.fromEntries(packs.map((p) => [p.id, p]));
  return {
    _id: o.id,
    id: o.id,
    user: o.user_id,
    customerName: o.customer_name,
    customerPhone: o.customer_phone,
    customerEmail: o.customer_email,
    deliveryAddress: o.delivery_address,
    totalAmount: Number(o.total_amount),
    paymentMethod: o.payment_method,
    orderStatus: o.order_status,
    createdAt: o.created_at,
    updatedAt: o.updated_at,
    items: items.map((i) => ({
      product: i.product_id
        ? pMap[i.product_id]
          ? {
              _id: pMap[i.product_id].id,
              id: pMap[i.product_id].id,
              productName: pMap[i.product_id].product_name,
              productImage: pMap[i.product_id].product_image,
              productPrice: Number(pMap[i.product_id].product_price),
            }
          : null
        : null,
      pack: i.pack_id
        ? packMap[i.pack_id]
          ? {
              _id: packMap[i.pack_id].id,
              id: packMap[i.pack_id].id,
              packName: packMap[i.pack_id].pack_name,
              packImage: packMap[i.pack_id].pack_image,
              packPrice: Number(packMap[i.pack_id].pack_price),
            }
          : null
        : null,
      quantity: i.quantity,
      price: Number(i.price),
    })),
  };
};

exports.createOrder = async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      deliveryAddress,
      items,
      totalAmount,
      paymentMethod,
    } = req.body;
    if (
      !customerName ||
      !customerPhone ||
      !deliveryAddress ||
      !items ||
      items.length === 0 ||
      !totalAmount
    ) {
      return res.status(400).json({ message: "Please provide all required details" });
    }
    const order = await Order.create(
      {
        user_id: req.user ? req.user.id : null,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        delivery_address: deliveryAddress,
        total_amount: totalAmount,
        payment_method: paymentMethod,
      },
      items
    );
    const shaped = await shapeOrder(order);
    res.status(201).json({ message: "Order placed successfully", data: shaped });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const rows = await Order.findMyOrders(req.user.id);
    const data = await Promise.all(rows.map(shapeOrder));
    res.status(200).json({ total: data.length, data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const rows = await Order.findAll();
    const data = await Promise.all(rows.map(shapeOrder));
    res.status(200).json({ total: data.length, data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSingleOrder = async (req, res) => {
  try {
    const o = await Order.findById(req.params.id);
    if (!o) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ data: await shapeOrder(o) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const [updated] = await Order.updateStatus(req.params.id, orderStatus);
    if (!updated) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ message: "Order status updated", data: await shapeOrder(updated) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const deleted = await Order.remove(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.trackOrder = async (req, res) => {
  try {
    const { customerPhone } = req.body;
    if (!customerPhone) {
      return res.status(400).json({ message: "Phone number is required" });
    }
    const rows = await Order.findByPhoneAndUser(req.user.id, customerPhone);
    const data = await Promise.all(rows.map(shapeOrder));
    res.status(200).json({ total: data.length, data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
