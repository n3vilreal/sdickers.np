import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../api";
import { getUser, isLoggedIn, isAdmin, logout } from "../auth";
import { FaSearch, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    setUser(isLoggedIn() ? getUser() : null);
    setMenuOpen(false);
  }, [location]);
  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
    }
    logout();
    setUser(null);
    setMenuOpen(false);
    navigate("/login");
  };
  const go = (path) => {
    setMenuOpen(false);
    navigate(path);
  };
  return (
    <div className="min-h-12.5 w-screen bg-black text-white sticky top-0 z-50">
    <div className="h-12.5 flex justify-between items-center text-[11px] px-4 md:px-0">
      <div className="flex justify-between items-center gap-x-4">
        <div
          className="font-sans font-extrabold text-2xl cursor-pointer"
          onClick={() => go("/")}
        >
          SDICKERS
        </div>
        <ul className="hidden md:flex gap-x-11 text-[11px]">
          <li
            className="hover:text-[#00ff66] cursor-pointer duration-500"
            onClick={() => go("/marketplace")}
          >
            DROPS
          </li>
          <li
            className="hover:text-[#00ff66] cursor-pointer duration-500"
            onClick={() => go("/marketplace")}
          >
            COLLECTIONS
          </li>
          <li
            className="hover:text-[#00ff66] cursor-pointer duration-500"
            onClick={() => go("/marketplace")}
          >
            BEST SELLERS
          </li>
          {isLoggedIn() && (
            <li
              className="hover:text-[#00ff66] cursor-pointer duration-500"
              onClick={() => go("/orders")}
            >
              MY ORDERS
            </li>
          )}
        </ul>
      </div>
      <div className="flex items-center text-2xl text-white gap-x-4 md:mx-10 md:gap-x-4">
        {isAdmin() && (
          <button
            onClick={() => go("/admin")}
            className="hidden sm:block h-[30px] px-4 bg-[#00ff66] text-xs text-black font-semibold rounded-full hover:bg-black hover:text-[#00ff66] hover:outline hover:outline-[#00ff66] duration-300 cursor-pointer"
          >
            ADMIN
          </button>
        )}
        {!user ? (
          <>
            <button
              onClick={() => go("/login")}
              className="hidden sm:block w-[90px] h-[30px] bg-white text-xs text-black font-semibold rounded-full hover:bg-black hover:text-[#00ff66] hover:outline hover:outline-[#00ff66] duration-300 cursor-pointer"
            >
              LOG IN
            </button>
            <button
              onClick={() => go("/signup")}
              className="hidden sm:block w-[90px] h-[30px] bg-[#00ff66] text-xs text-black font-semibold rounded-full hover:bg-black hover:text-[#00ff66] hover:outline hover:outline-[#00ff66] duration-300 cursor-pointer"
            >
              SIGN UP
            </button>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="hidden sm:block w-[100px] h-[30px] bg-red-600 text-xs text-white font-semibold rounded-full hover:bg-black hover:text-red-500 hover:outline hover:outline-red-500 duration-300 cursor-pointer"
          >
            LOG OUT
          </button>
        )}
        <FaSearch
          className="cursor-pointer hover:text-[#00ff66]"
          onClick={() => go("/marketplace")}
          title="Search stickers"
        />
        <FaShoppingCart
          className="cursor-pointer hover:text-[#00ff66]"
          onClick={() => go(isLoggedIn() ? "/cart" : "/login")}
          title="Cart"
        />
        <button
          className="md:hidden text-2xl cursor-pointer hover:text-[#00ff66]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </div>
    {menuOpen && (
      <div className="md:hidden bg-black border-t border-[#2e2e2e] px-6 py-4 flex flex-col gap-y-4 text-sm">
        <span className="hover:text-[#00ff66] cursor-pointer duration-500" onClick={() => go("/marketplace")}>DROPS</span>
        <span className="hover:text-[#00ff66] cursor-pointer duration-500" onClick={() => go("/marketplace")}>COLLECTIONS</span>
        <span className="hover:text-[#00ff66] cursor-pointer duration-500" onClick={() => go("/marketplace")}>BEST SELLERS</span>
        {isLoggedIn() && (
          <span className="hover:text-[#00ff66] cursor-pointer duration-500" onClick={() => go("/orders")}>MY ORDERS</span>
        )}
        {isAdmin() && (
          <span
            className="text-[#00ff66] font-semibold cursor-pointer"
            onClick={() => go("/admin")}
          >
            ADMIN PANEL
          </span>
        )}
        {!user ? (
          <div className="flex gap-x-3 pt-2">
            <button
              onClick={() => go("/login")}
              className="flex-1 h-10 bg-white text-xs text-black font-semibold rounded-full cursor-pointer"
            >
              LOG IN
            </button>
            <button
              onClick={() => go("/signup")}
              className="flex-1 h-10 bg-[#00ff66] text-xs text-black font-semibold rounded-full cursor-pointer"
            >
              SIGN UP
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="w-full h-10 bg-red-600 text-xs text-white font-semibold rounded-full cursor-pointer"
          >
            LOG OUT
          </button>
        )}
      </div>
    )}
    </div>
  );
}
