import React, { useEffect, useState } from "react";
import api from "../../api";
export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, users: 0, orders: 0 });
  const [revenue, setRevenue] = useState(0);
  const [recent, setRecent] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const [productsRes, usersRes, ordersRes] = await Promise.all([
          api.get("/products"),
          api.get("/users"),
          api.get("/orders"),
        ]);
        setStats({
          products: productsRes.data.total ?? productsRes.data.data.length,
          users: usersRes.data.total ?? usersRes.data.data.length,
          orders: ordersRes.data.total ?? ordersRes.data.data.length,
        });
        const orders = ordersRes.data.data;
        setRevenue(orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0));
        setRecent(orders.slice(0, 5));
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Products" value={stats.products} />
        <StatCard label="Users" value={stats.users} />
        <StatCard label="Orders" value={stats.orders} />
        <StatCard label="Revenue" value={`Rs. ${revenue}`} />
      </div>
      <h2 className="text-xl font-semibold text-white mt-12 mb-4">
        Recent Orders
      </h2>
      <div className="bg-[#181818] border border-[#2e2e2e] rounded-2xl overflow-hidden">
        {recent.length === 0 ? (
          <div className="p-6 text-sm text-[#8a8a8a]">No orders yet.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-[#8a8a8a] text-xs uppercase border-b border-[#2e2e2e]">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((o) => (
                <tr key={o._id} className="border-b border-[#2e2e2e]">
                  <td className="p-4 text-white">{o.customerName}</td>
                  <td className="p-4 text-[#00ff66]">Rs. {o.totalAmount}</td>
                  <td className="p-4 text-[#8a8a8a]">{o.orderStatus}</td>
                  <td className="p-4 text-[#8a8a8a]">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
function StatCard({ label, value }) {
  return (
    <div className="bg-[#181818] border border-[#2e2e2e] rounded-2xl p-6">
      <div className="text-xs text-[#8a8a8a] uppercase tracking-wide">
        {label}
      </div>
      <div className="text-3xl font-bold text-[#00ff66] mt-2">{value}</div>
    </div>
  );
}
