import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../api";
import { getUser, isLoggedIn, isAdmin, logout } from "../auth";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  useEffect(() => {
    setUser(isLoggedIn() ? getUser() : null);
  }, [location]);
  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
    }
    logout();
    setUser(null);
    navigate("/login");
  };
  return (
    <div className="h-12.5 w-screen bg-black text-white flex justify-between text-[11px] sticky top-0 z-50">
      <div className="flex justify-between items-center">
        <div
          className="font-sans font-extrabold px-8 text-2xl cursor-pointer"
          onClick={() => navigate("/")}
        >
          SDICKERS
        </div>
        <ul className="flex gap-x-11 text-[11px]">
          <li
            className="hover:text-[#00ff66] cursor-pointer duration-500"
            onClick={() => navigate("/marketplace")}
          >
            DROPS
          </li>
          <li
            className="hover:text-[#00ff66] cursor-pointer duration-500"
            onClick={() => navigate("/marketplace")}
          >
            COLLECTIONS
          </li>
          <li
            className="hover:text-[#00ff66] cursor-pointer duration-500"
            onClick={() => navigate("/marketplace")}
          >
            BEST SELLERS
          </li>
          {isLoggedIn() && (
            <li
              className="hover:text-[#00ff66] cursor-pointer duration-500"
              onClick={() => navigate("/orders")}
            >
              MY ORDERS
            </li>
          )}
        </ul>
      </div>
      <div className="flex items-center text-2xl text-white mx-10 gap-x-4">
        {isAdmin() && (
          <button
            onClick={() => navigate("/admin")}
            className="h-[30px] px-4 bg-[#00ff66] text-xs text-black font-semibold rounded-full hover:bg-black hover:text-[#00ff66] hover:outline hover:outline-[#00ff66] duration-300 cursor-pointer"
          >
            ADMIN
          </button>
        )}
        {!user ? (
          <>
            <button
              onClick={() => navigate("/login")}
              className="w-[90px] h-[30px] bg-white text-xs text-black font-semibold rounded-full hover:bg-black hover:text-[#00ff66] hover:outline hover:outline-[#00ff66] duration-300 cursor-pointer"
            >
              LOG IN
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="w-[90px] h-[30px] bg-[#00ff66] text-xs text-black font-semibold rounded-full hover:bg-black hover:text-[#00ff66] hover:outline hover:outline-[#00ff66] duration-300 cursor-pointer"
            >
              SIGN UP
            </button>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="w-[100px] h-[30px] bg-red-600 text-xs text-white font-semibold rounded-full hover:bg-black hover:text-red-500 hover:outline hover:outline-red-500 duration-300 cursor-pointer"
          >
            LOG OUT
          </button>
        )}
        <FaSearch
          className="cursor-pointer hover:text-[#00ff66]"
          onClick={() => navigate("/marketplace")}
          title="Search stickers"
        />
        <FaShoppingCart
          className="cursor-pointer hover:text-[#00ff66]"
          onClick={() => navigate(isLoggedIn() ? "/cart" : "/login")}
          title="Cart"
        />
      </div>
    </div>
  );
}
