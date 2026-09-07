import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { getUser } from "../auth";
export default function Checkout() {
  const navigate = useNavigate();
  const user = getUser();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [form, setForm] = useState({
    customerName: user?.userName || "",
    customerPhone: user?.userPhoneNumber || "",
    customerEmail: user?.userEmail || "",
    deliveryAddress: "",
    paymentMethod: "Cash on Delivery",
  });
  const fetchCart = async () => {
    try {
      const res = await api.get("/cart");
      setItems((res.data.data?.items || []).filter((i) => i.product));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCart();
  }, []);
  const total = items.reduce(
    (sum, item) => sum + item.product.productPrice * item.quantity,
    0,
  );
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const placeOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      return alert("Your cart is empty.");
    }
    const orderItems = items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.productPrice,
    }));
    try {
      setPlacing(true);
      await api.post("/order", {
        ...form,
        items: orderItems,
        totalAmount: total,
      });
      await api.delete("/cart/clear");
      alert("Order placed successfully!");
      navigate("/orders");
    } catch (error) {
      alert(error.response?.data?.message || "Could not place order");
    } finally {
      setPlacing(false);
    }
  };
  if (loading) {
    return (
      <div className="w-screen min-h-screen bg-[#111111] flex items-center justify-center text-[#8a8a8a]">
        Loading...
      </div>
    );
  }
  return (
    <div className="w-screen min-h-screen bg-[#111111] py-12 px-6 md:px-24">
      <h1 className="text-3xl font-bold text-white mb-8">CHECKOUT</h1>
      <div className="flex flex-col lg:flex-row gap-10">
        <form
          onSubmit={placeOrder}
          className="flex-1 flex flex-col gap-5 bg-[#181818] border border-[#2e2e2e] rounded-2xl p-6"
        >
          <span className="text-white font-semibold">DELIVERY DETAILS</span>
          <Field
            label="FULL NAME"
            name="customerName"
            value={form.customerName}
            onChange={handleChange}
            required
          />
          <Field
            label="PHONE NUMBER"
            name="customerPhone"
            value={form.customerPhone}
            onChange={handleChange}
            required
          />
          <Field
            label="EMAIL"
            name="customerEmail"
            type="email"
            value={form.customerEmail}
            onChange={handleChange}
          />
          <div className="flex flex-col gap-y-2">
            <span className="text-[10px] text-[#8a8a8a]">DELIVERY ADDRESS</span>
            <textarea
              name="deliveryAddress"
              value={form.deliveryAddress}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Street, City, Landmark..."
              className="border border-[#2e2e2e] rounded-[10px] bg-[#111111] text-white px-4 py-3 text-sm placeholder-[#515151] outline-none focus:border-[#00ff66]"
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <span className="text-[10px] text-[#8a8a8a]">PAYMENT METHOD</span>
            <select
              name="paymentMethod"
              value={form.paymentMethod}
              onChange={handleChange}
              className="border border-[#2e2e2e] rounded-[10px] bg-[#111111] text-white px-4 h-12 text-sm outline-none focus:border-[#00ff66]"
            >
              <option>Cash on Delivery</option>
              <option>eSewa</option>
              <option>Khalti</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={placing}
            className="h-11 mt-2 rounded-lg bg-[#00ff66] text-black text-xs font-semibold hover:bg-white duration-300 cursor-pointer disabled:opacity-50"
          >
            {placing ? "PLACING ORDER..." : "PLACE ORDER"}
          </button>
        </form>
        <div className="w-full lg:w-80 bg-[#181818] border border-[#2e2e2e] rounded-2xl p-6 h-fit">
          <h2 className="text-white font-semibold mb-4">ORDER SUMMARY</h2>
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div
                key={item.product._id}
                className="flex justify-between text-sm text-[#8a8a8a]"
              >
                <span className="truncate mr-2">
                  {item.product.productName} x {item.quantity}
                </span>
                <span className="text-white flex-shrink-0">
                  Rs. {item.product.productPrice * item.quantity}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-white font-bold text-lg border-t border-[#2e2e2e] pt-4 mt-4">
            <span>Total</span>
            <span>Rs. {total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
function Field({ label, ...props }) {
  return (
    <div className="flex flex-col gap-y-2">
      <span className="text-[10px] text-[#8a8a8a]">{label}</span>
      <input
        {...props}
        className="border border-[#2e2e2e] rounded-[10px] h-12 bg-[#111111] text-white px-4 text-sm placeholder-[#515151] outline-none focus:border-[#00ff66]"
      />
    </div>
  );
}
