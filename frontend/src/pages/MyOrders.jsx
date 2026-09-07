import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
const statusColor = {
  Pending: "text-yellow-400",
  Confirmed: "text-blue-400",
  Packed: "text-purple-400",
  Shipped: "text-orange-400",
  Delivered: "text-[#00ff66]",
  Cancelled: "text-red-500",
};
export default function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/myorders");
        setOrders(res.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  if (loading) {
    return (
      <div className="w-screen min-h-screen bg-[#111111] flex items-center justify-center text-[#8a8a8a]">
        Loading...
      </div>
    );
  }
  return (
    <div className="w-screen min-h-screen bg-[#111111] py-12 px-6 md:px-24">
      <h1 className="text-3xl font-bold text-white mb-8">MY ORDERS</h1>
      {orders.length === 0 ? (
        <div className="flex flex-col items-start gap-4">
          <span className="text-[#8a8a8a] text-sm">
            You haven't placed any orders yet.
          </span>
          <button
            onClick={() => navigate("/marketplace")}
            className="h-10 px-6 rounded-lg bg-[#00ff66] text-black text-xs font-semibold cursor-pointer"
          >
            BROWSE STICKERS
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-[#181818] border border-[#2e2e2e] rounded-2xl p-5"
            >
              <div className="flex justify-between items-center flex-wrap gap-2">
                <span className="text-xs text-[#8a8a8a]">
                  Order #{order._id.slice(-6).toUpperCase()} ·{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
                <span
                  className={`text-xs font-semibold ${
                    statusColor[order.orderStatus] || "text-white"
                  }`}
                >
                  {order.orderStatus}
                </span>
              </div>
              <div className="mt-3 flex flex-col gap-1">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between text-sm text-[#8a8a8a]"
                  >
                    <span>
                      {item.product?.productName || "Sticker"} x {item.quantity}
                    </span>
                    <span className="text-white">Rs. {item.price}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between border-t border-[#2e2e2e] mt-3 pt-3">
                <span className="text-xs text-[#8a8a8a]">
                  {order.paymentMethod}
                </span>
                <span className="text-[#00ff66] font-bold">
                  Rs. {order.totalAmount}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
