import React, { useEffect, useMemo, useState } from "react";
import api from "../../api";
const STATUSES = [
  "Pending",
  "Confirmed",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
];
const PLACEHOLDER =
  "https://placehold.co/120x120/181818/00ff66?text=Sticker";
const PACK_PLACEHOLDER =
  "https://placehold.co/120x120/181818/00ff66?text=Pack";
const orderCode = (o) =>
  `#${String(o._id).padStart(6, "0").slice(-6).toUpperCase()}`;
export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
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
  const counts = useMemo(() => {
    const c = { All: orders.length };
    STATUSES.forEach((s) => {
      c[s] = orders.filter((o) => o.orderStatus === s).length;
    });
    return c;
  }, [orders]);
  const filtered =
    statusFilter === "All"
      ? orders
      : orders.filter((o) => o.orderStatus === statusFilter);
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
        <>
          <div className="flex flex-wrap gap-2 mb-6">
            {["All", ...STATUSES].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 h-9 rounded-full text-xs font-semibold cursor-pointer duration-200 border ${
                  statusFilter === s
                    ? "bg-[#00ff66] text-black border-[#00ff66]"
                    : "bg-[#181818] text-[#8a8a8a] border-[#2e2e2e] hover:text-white hover:border-[#00ff66]"
                }`}
              >
                {s} ({counts[s]})
              </button>
            ))}
          </div>
          {filtered.length === 0 ? (
            <div className="text-[#8a8a8a] text-sm">
              No orders with status "{statusFilter}".
            </div>
          ) : (
            <div className="bg-[#181818] border border-[#2e2e2e] rounded-2xl overflow-x-auto">
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
                  {filtered.map((o) => (
                    <React.Fragment key={o._id}>
                      <tr className="border-b border-[#2e2e2e]">
                        <td className="p-4 text-white">
                          {orderCode(o)}
                          <div className="text-[10px] text-[#515151]">
                            {new Date(o.createdAt).toLocaleString()}
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-[#8a8a8a] mb-4">
                              <div>
                                <span className="text-white">Delivery: </span>
                                {o.deliveryAddress}
                              </div>
                              <div>
                                {o.customerEmail ? (
                                  <>
                                    <span className="text-white">Email: </span>
                                    {o.customerEmail}
                                  </>
                                ) : null}
                              </div>
                            </div>
                            <div className="text-[10px] text-[#515151] uppercase mb-2">
                              Ordered items ({o.items.length})
                            </div>
                            <div className="flex flex-col gap-3">
                              {o.items.map((item, idx) => {
                                const isPack = !!item.pack;
                                const entry = isPack ? item.pack : item.product;
                                const name = isPack
                                  ? item.pack?.packName
                                  : item.product?.productName;
                                const image = isPack
                                  ? item.pack?.packImage
                                  : item.product?.productImage;
                                return (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-4 bg-[#181818] border border-[#2e2e2e] rounded-xl p-3 max-w-2xl"
                                  >
                                    <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center p-1 flex-shrink-0">
                                      <img
                                        src={image || (isPack ? PACK_PLACEHOLDER : PLACEHOLDER)}
                                        alt={name || "Sticker"}
                                        onError={(e) => {
                                          e.currentTarget.src = isPack ? PACK_PLACEHOLDER : PLACEHOLDER;
                                        }}
                                        className="w-full h-full object-contain"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-white font-semibold text-sm truncate">
                                        {name || "Sticker"}
                                        {isPack && (
                                          <span className="bg-[#00ff66] text-black text-[9px] font-bold px-2 py-0.5 rounded-full ml-2">
                                            PACK
                                          </span>
                                        )}
                                      </div>
                                      {!isPack && item.product?.productCategory && (
                                        <div className="text-[10px] text-[#515151] uppercase">
                                          {item.product.productCategory}
                                        </div>
                                      )}
                                      <div className="text-xs text-[#8a8a8a] mt-1">
                                        Rs. {item.price} x {item.quantity}
                                      </div>
                                    </div>
                                    <div className="text-white font-bold text-sm flex-shrink-0">
                                      Rs. {item.price * item.quantity}
                                    </div>
                                  </div>
                                );
                              })}
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
        </>
      )}
    </div>
  );
}
