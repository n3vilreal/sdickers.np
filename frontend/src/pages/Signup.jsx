import React, { useState } from "react";
import api from "../api";
import { MdWorkspacePremium } from "react-icons/md";
import { IoIosStar } from "react-icons/io";
import { PiStickerFill } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import LeftImage from "../assets/images/signup-left.png";
export default function Signup() {
  const navigate = useNavigate();
  const bgImage ={LeftImage};
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return alert("Passwords do not match.");
    }
    try {
      setLoading(true);
      const response = await api.post("/register", {
        username: formData.username,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
      });
      alert(response.data.message);
      setFormData({
        username: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
      });
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-screen h-screen flex bg-black">
      <div
        className="h-full w-[50%] flex flex-col justify-center p-28"
        style={{ backgroundImage: `url(${LeftImage})` }}
      >
        <span className="text-xl text-white font-bold mb-7">SDICKERS</span>
        <span className="text-6xl text-white font-extrabold mb-2">
          BECOME A
          <br />
          COLLECTOR
        </span>
        <span className="text-xs text-[#8a8a8a]">
          Get access to Premium Drops, Exclusive Merch and Members-Only Pricing.
        </span>
        <div className="flex flex-col mt-10 gap-y-3">
          <div className="flex text-xs font-semibold text-white items-center gap-x-2">
            <MdWorkspacePremium className="text-[#00ff66] text-2xl" />
            <span>PREMIUM DROPS</span>
          </div>
          <div className="flex text-xs font-semibold text-white items-center gap-x-2">
            <PiStickerFill className="text-[#00ff66] text-2xl" />
            <span>EXCLUSIVE MERCH</span>
          </div>
          <div className="flex text-xs font-semibold text-white items-center gap-x-2">
            <IoIosStar className="text-[#00ff66] text-2xl" />
            <span>MEMBER ONLY PRICING</span>
          </div>
        </div>
      </div>
      <div className="h-full w-[50%] bg-[#111111] flex items-center justify-center">
        <form onSubmit={handleSignup} className="flex flex-col gap-y-5 w-[50%]">
          <div className="flex flex-col">
            <span className="text-3xl text-white font-semibold">
              JOIN SDICKERS
            </span>
            <span className="text-[10px] text-[#8a8a8a]">
              CREATE YOUR PROFILE TO START YOUR COLLECTION
            </span>
          </div>
          <div className="flex flex-col gap-y-2">
            <span className="text-[10px] text-[#8a8a8a]">FULL NAME</span>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Hari Bahadur"
              required
              className="border border-[#8a8a8a] rounded-[10px] h-12 bg-[#181818] text-white px-4 text-sm"
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <span className="text-[10px] text-[#8a8a8a]">EMAIL ADDRESS</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              required
              className="border border-[#8a8a8a] rounded-[10px] h-12 bg-[#181818] text-white px-4 text-sm"
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <span className="text-[10px] text-[#8a8a8a]">PHONE NUMBER</span>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="98XXXXXXXX"
              required
              className="border border-[#8a8a8a] rounded-[10px] h-12 bg-[#181818] text-white px-4 text-sm"
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <span className="text-[10px] text-[#8a8a8a]">PASSWORD</span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="border border-[#8a8a8a] rounded-[10px] h-12 bg-[#181818] text-white px-4 text-sm"
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <span className="text-[10px] text-[#8a8a8a]">CONFIRM PASSWORD</span>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="border border-[#8a8a8a] rounded-[10px] h-12 bg-[#181818] text-white px-4 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-white h-10 rounded-[10px] text-xs font-semibold hover:text-[#00ff66] duration-300 hover:bg-black hover:border hover:border-[#00ff66] disabled:opacity-50"
          >
            {loading ? "CREATING ACCOUNT..." : "CREATE MY ACCOUNT"}
          </button>
        </form>
      </div>
    </div>
  );
}
