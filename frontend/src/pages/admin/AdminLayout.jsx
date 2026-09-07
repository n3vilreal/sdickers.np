import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { getUser, logout } from "../../auth";
const links = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/orders", label: "Orders" },
];
export default function AdminLayout() {
  const navigate = useNavigate();
  const user = getUser();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <div className="flex min-h-screen w-screen bg-[#111111]">
      <aside className="w-64 bg-black flex flex-col justify-between py-8 px-6 sticky top-0 h-screen">
        <div>
          <div
            className="text-2xl font-extrabold text-white mb-1 cursor-pointer"
            onClick={() => navigate("/")}
          >
            SDICKERS
          </div>
          <div className="text-[10px] text-[#00ff66] tracking-widest mb-10">
            ADMIN CMS
          </div>
          <nav className="flex flex-col gap-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg text-sm font-semibold duration-200 ${
                    isActive
                      ? "bg-[#00ff66] text-black"
                      : "text-[#8a8a8a] hover:text-white hover:bg-[#181818]"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="flex flex-col gap-3">
          <div className="text-xs text-[#8a8a8a]">
            {user?.userName}
            <div className="text-[10px] text-[#515151]">{user?.userEmail}</div>
          </div>
          <button
            onClick={() => navigate("/")}
            className="text-xs text-[#8a8a8a] hover:text-[#00ff66] text-left cursor-pointer"
          >
            View store →
          </button>
          <button
            onClick={handleLogout}
            className="h-9 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 cursor-pointer"
          >
            LOG OUT
          </button>
        </div>
      </aside>
      <main className="flex-1 p-10 overflow-x-auto">
        <Outlet />
      </main>
    </div>
  );
}
