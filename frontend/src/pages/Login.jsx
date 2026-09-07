import React, { useState } from "react";
import api from "../api";
import { setAuth } from "../auth";
import LeftImage from "../assets/images/login-left.jpeg";
import { useNavigate, Link } from "react-router-dom";
export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.post("/login", formData);
      setAuth(response.data.token, response.data.user);
      if (response.data.user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-screen h-screen flex bg-black">
      <div
        className="h-full w-[50%] flex flex-col justify-center p-28 bg-contain"
        style={{ backgroundImage: `url(${LeftImage})` }}
      >
        <span className="text-xl text-white font-bold">SDICKERS</span>
        <span className="text-6xl text-white font-extrabold">
          THE COLLECTOR <br /> PORTAL
        </span>
        <span className="text-xs text-[#8a8a8a]">
          Access your vault, track your orders, and get ready for the next drop.
        </span>
      </div>
      <div className="h-full w-[50%] bg-[#111111] flex flex-col items-center justify-around">
        <form
          onSubmit={handleLogin}
          className="h-full w-[50%] flex flex-col justify-center gap-y-10"
        >
          <div className="flex flex-col">
            <span className="text-2xl text-white font-bold">WELCOME BACK</span>
            <span className="text-[10px] text-[#8a8a8a]">
              ENTER YOUR CREDENTIALS TO ENTER THE VAULT
            </span>
          </div>
          <div className="flex flex-col gap-y-7">
            <div className="flex flex-col">
              <span className="text-[10px] text-[#8a8a8a]">EMAIL ADDRESS</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
                required
                className="border border-[#8a8a8a] rounded-[10px] h-12 bg-[#181818] placeholder-[#515151] text-white px-4 text-sm"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex justify-between">
                <span className="text-[10px] text-[#8a8a8a]">PASSWORD</span>
                <span className="text-[10px] text-[#00ff66] font-semibold cursor-pointer">
                  FORGOT?
                </span>
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="border border-[#8a8a8a] rounded-[10px] h-12 bg-[#181818] placeholder-[#515151] text-white px-4 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-white h-10 rounded-[10px] text-xs font-semibold hover:text-[#00ff66] duration-300 hover:bg-black hover:border hover:border-[#00ff66] cursor-pointer disabled:opacity-50"
            >
              {loading ? "SIGNING IN..." : "SIGN IN TO VAULT"}
            </button>
            <div className="flex justify-center gap-x-5">
              <span className="text-xs text-[#8a8a8a]">
                Don't have an account?
              </span>
              <Link
                to="/signup"
                className="text-xs font-semibold text-white cursor-pointer hover:text-[#00ff66]"
              >
                CREATE ACCOUNT
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
