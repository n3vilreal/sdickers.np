import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
const PLACEHOLDER =
  "https://placehold.co/120x120/181818/00ff66?text=Sticker";
export default function Cart() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await api.get("/cart");
      setItems(res.data.data?.items || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCart();
  }, []);
  const updateQty = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      await api.patch(`/cart/update/${productId}`, { quantity });
      fetchCart();
    } catch (error) {
      alert(error.response?.data?.message || "Could not update quantity");
    }
  };
  const removeItem = async (productId) => {
    try {
      await api.delete(`/cart/remove/${productId}`);
      fetchCart();
    } catch (error) {
      alert(error.response?.data?.message || "Could not remove item");
    }
  };
  const clearCart = async () => {
    if (!confirm("Clear your entire cart?")) return;
    try {
      await api.delete("/cart/clear");
      fetchCart();
    } catch (error) {
      alert(error.response?.data?.message || "Could not clear cart");
    }
  };
  const validItems = items.filter((item) => item.product);
  const total = validItems.reduce(
    (sum, item) => sum + item.product.productPrice * item.quantity,
    0,
  );
  if (loading) {
    return (
      <div className="w-screen min-h-screen bg-[#111111] flex items-center justify-center text-[#8a8a8a]">
        Loading...
      </div>
    );
  }
  return (
    <div className="w-screen min-h-screen bg-[#111111] py-12 px-6 md:px-24">
      <h1 className="text-3xl font-bold text-white mb-8">YOUR CART</h1>
      {validItems.length === 0 ? (
        <div className="flex flex-col items-start gap-4">
          <span className="text-[#8a8a8a] text-sm">Your cart is empty.</span>
          <button
            onClick={() => navigate("/marketplace")}
            className="h-10 px-6 rounded-lg bg-[#00ff66] text-black text-xs font-semibold cursor-pointer"
          >
            BROWSE STICKERS
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1 flex flex-col gap-4">
            {validItems.map((item) => (
              <div
                key={item.product._id}
                className="flex items-center gap-5 bg-[#181818] border border-[#2e2e2e] rounded-2xl p-4"
              >
                <div className="w-24 h-24 bg-white rounded-xl flex items-center justify-center p-2 flex-shrink-0">
                  <img
                    src={item.product.productImage || PLACEHOLDER}
                    alt={item.product.productName}
                    onError={(e) => {
                      e.currentTarget.src = PLACEHOLDER;
                    }}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <div
                    className="text-white font-semibold cursor-pointer hover:text-[#00ff66]"
                    onClick={() => navigate(`/product/${item.product._id}`)}
                  >
                    {item.product.productName}
                  </div>
                  <div className="text-xs text-[#8a8a8a] uppercase">
                    {item.product.productCategory}
                  </div>
                  <div className="text-[#00ff66] font-bold mt-1">
                    Rs. {item.product.productPrice}
                  </div>
                </div>
                <div className="flex items-center border border-[#2e2e2e] rounded-lg">
                  <button
                    onClick={() =>
                      updateQty(item.product._id, item.quantity - 1)
                    }
                    className="w-8 h-8 text-white cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-white">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQty(item.product._id, item.quantity + 1)
                    }
                    className="w-8 h-8 text-white cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.product._id)}
                  className="text-red-500 text-xs font-semibold cursor-pointer hover:underline"
                >
                  REMOVE
                </button>
              </div>
            ))}
            <button
              onClick={clearCart}
              className="self-start text-xs text-[#8a8a8a] hover:text-red-500 cursor-pointer mt-2"
            >
              Clear cart
            </button>
          </div>
          <div className="w-full lg:w-80 bg-[#181818] border border-[#2e2e2e] rounded-2xl p-6 h-fit">
            <h2 className="text-white font-semibold mb-4">ORDER SUMMARY</h2>
            <div className="flex justify-between text-sm text-[#8a8a8a] mb-2">
              <span>Items</span>
              <span>{validItems.length}</span>
            </div>
            <div className="flex justify-between text-white font-bold text-lg border-t border-[#2e2e2e] pt-4 mt-4">
              <span>Total</span>
              <span>Rs. {total}</span>
            </div>
            <button
              onClick={() => navigate("/checkout")}
              className="w-full h-11 mt-6 rounded-lg bg-[#00ff66] text-black text-xs font-semibold hover:bg-white duration-300 cursor-pointer"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
