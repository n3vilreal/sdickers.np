import React, { useEffect, useState } from "react";
import api from "../../api";
import { getUser } from "../../auth";
export default function AdminUsers() {
  const currentUser = getUser();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users");
      setUsers(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  const changeRole = async (id, role) => {
    try {
      await api.patch(`/user/${id}/role`, { role });
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || "Could not update role");
    }
  };
  const remove = async (id) => {
    if (!confirm("Delete this user?")) return;
    try {
      await api.delete(`/user/${id}`);
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || "Could not delete user");
    }
  };
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Users</h1>
      {loading ? (
        <div className="text-[#8a8a8a] text-sm">Loading...</div>
      ) : (
        <div className="bg-[#181818] border border-[#2e2e2e] rounded-2xl overflow-hidden">
          <table className="w-full text-left text-sm min-w-[700px]">
            <thead className="text-[#8a8a8a] text-xs uppercase border-b border-[#2e2e2e]">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Role</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isSelf = currentUser?.id === u._id;
                return (
                  <tr key={u._id} className="border-b border-[#2e2e2e]">
                    <td className="p-4 text-white">
                      {u.userName}
                      {isSelf && (
                        <span className="text-[10px] text-[#00ff66] ml-2">
                          (you)
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-[#8a8a8a]">{u.userEmail}</td>
                    <td className="p-4 text-[#8a8a8a]">{u.userPhoneNumber}</td>
                    <td className="p-4">
                      <select
                        value={u.role}
                        disabled={isSelf}
                        onChange={(e) => changeRole(u._id, e.target.value)}
                        className="bg-[#111111] border border-[#2e2e2e] rounded-lg text-white text-xs px-3 h-9 outline-none focus:border-[#00ff66] disabled:opacity-50"
                      >
                        <option value="customer">customer</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => remove(u._id)}
                        disabled={isSelf}
                        className="text-red-500 text-xs font-semibold hover:underline cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:no-underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
