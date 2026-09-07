import React, { useEffect, useState } from "react";
import api from "../../api";
const STATUSES = [
  "Pending",
  "Confirmed",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
];
export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/orders");
      setOrders(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);
  const changeStatus = async (id, orderStatus) => {
    try {
      await api.patch(`/order/${id}/status`, { orderStatus });
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || "Could not update status");
    }
  };
  const remove = async (id) => {
    if (!confirm("Delete this order?")) return;
    try {
      await api.delete(`/order/${id}`);
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || "Could not delete order");
    }
  };
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Orders</h1>
      {loading ? (
        <div className="text-[#8a8a8a] text-sm">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="text-[#8a8a8a] text-sm">No orders yet.</div>
      ) : (
        <div className="bg-[#181818] border border-[#2e2e2e] rounded-2xl overflow-hidden">
          <table className="w-full text-left text-sm min-w-[800px]">
            <thead className="text-[#8a8a8a] text-xs uppercase border-b border-[#2e2e2e]">
              <tr>
                <th className="p-4">Order</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Total</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <React.Fragment key={o._id}>
                  <tr className="border-b border-[#2e2e2e]">
                    <td className="p-4 text-white">
                      #{o._id.slice(-6).toUpperCase()}
                      <div className="text-[10px] text-[#515151]">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4 text-[#8a8a8a]">
                      {o.customerName}
                      <div className="text-[10px] text-[#515151]">
                        {o.customerPhone}
                      </div>
                    </td>
                    <td className="p-4 text-[#00ff66]">Rs. {o.totalAmount}</td>
                    <td className="p-4 text-[#8a8a8a]">{o.paymentMethod}</td>
                    <td className="p-4">
                      <select
                        value={o.orderStatus}
                        onChange={(e) => changeStatus(o._id, e.target.value)}
                        className="bg-[#111111] border border-[#2e2e2e] rounded-lg text-white text-xs px-3 h-9 outline-none focus:border-[#00ff66]"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() =>
                            setExpanded(expanded === o._id ? null : o._id)
                          }
                          className="text-[#00ff66] text-xs font-semibold hover:underline cursor-pointer"
                        >
                          {expanded === o._id ? "Hide" : "View"}
                        </button>
                        <button
                          onClick={() => remove(o._id)}
                          className="text-red-500 text-xs font-semibold hover:underline cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expanded === o._id && (
                    <tr className="border-b border-[#2e2e2e] bg-[#111111]">
                      <td colSpan={6} className="p-5">
                        <div className="text-xs text-[#8a8a8a] mb-3">
                          <span className="text-white">Delivery: </span>
                          {o.deliveryAddress}
                          {o.customerEmail ? ` · ${o.customerEmail}` : ""}
                        </div>
                        <div className="flex flex-col gap-1">
                          {o.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between text-xs text-[#8a8a8a] max-w-md"
                            >
                              <span>
                                {item.product?.productName || "Sticker"} x{" "}
                                {item.quantity}
                              </span>
                              <span className="text-white">
                                Rs. {item.price}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
