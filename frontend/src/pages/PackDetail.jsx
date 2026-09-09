import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { isLoggedIn } from "../auth";
import StickerCard from "../cards/StickerCard";
const PLACEHOLDER =
  "https://placehold.co/500x500/181818/00ff66?text=Pack";
export default function PackDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pack, setPack] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchPack = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/pack/${id}`);
        setPack(res.data.data);
      } catch (error) {
        console.log(error);
        setPack(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPack();
    setQuantity(1);
    window.scrollTo(0, 0);
  }, [id]);
  const addToCart = async () => {
    if (!isLoggedIn()) {
      alert("Please log in to add items to your cart.");
      return navigate("/login");
    }
    try {
      await api.post("/cart/add", { packId: id, quantity });
      alert("Pack added to cart!");
    } catch (error) {
      alert(error.response?.data?.message || "Could not add to cart");
    }
  };
  const buyNow = async () => {
    if (!isLoggedIn()) {
      alert("Please log in to continue.");
      return navigate("/login");
    }
    try {
      await api.post("/cart/add", { packId: id, quantity });
      navigate("/cart");
    } catch (error) {
      alert(error.response?.data?.message || "Could not proceed");
    }
  };
  if (loading) {
    return (
      <div className="w-screen min-h-screen bg-[#111111] flex items-center justify-center text-[#8a8a8a]">
        Loading...
      </div>
    );
  }
  if (!pack) {
    return (
      <div className="w-screen min-h-screen bg-[#111111] flex flex-col items-center justify-center gap-4 text-white">
        <span>Pack not found.</span>
        <button
          onClick={() => navigate("/packs")}
          className="h-10 px-6 rounded-lg bg-[#00ff66] text-black text-xs font-semibold"
        >
          BACK TO PACKS
        </button>
      </div>
    );
  }
  const outOfStock =
    pack.packStockQty <= 0 || pack.packStatus === "unavailable";
  const stickers = pack.packProducts || [];
  const stickerCount = stickers.length;
  return (
    <div className="w-screen min-h-screen bg-[#111111] py-12 px-6 md:px-24">
      <div className="flex flex-col md:flex-row gap-12">
        <div className="w-full md:w-[45%] bg-white rounded-2xl flex items-center justify-center p-10 h-[420px] relative">
          <img
            src={pack.packImage || PLACEHOLDER}
            alt={pack.packName}
            onError={(e) => {
              e.currentTarget.src = PLACEHOLDER;
            }}
            className="w-full h-full object-contain"
          />
          <span className="absolute top-4 left-4 bg-[#00ff66] text-black text-xs font-bold px-3 py-1 rounded-full">
            PACK
          </span>
        </div>
        <div className="w-full md:w-[55%] flex flex-col gap-y-5">
          <span className="text-xs text-[#00ff66] uppercase tracking-widest">
            Sticker Pack · {stickerCount} sticker{stickerCount === 1 ? "" : "s"}
          </span>
          <h1 className="text-4xl font-bold text-white">{pack.packName}</h1>
          <span className="text-3xl font-bold text-[#00ff66]">
            Rs. {pack.packPrice}
          </span>
          <p className="text-sm text-[#8a8a8a] leading-relaxed">
            {pack.packDescription}
          </p>
          <span
            className={`text-xs font-semibold ${
              outOfStock ? "text-red-500" : "text-[#00ff66]"
            }`}
          >
            {outOfStock
              ? "OUT OF STOCK"
              : `IN STOCK (${pack.packStockQty} available)`}
          </span>
          {!outOfStock && (
            <div className="flex items-center gap-4">
              <span className="text-xs text-[#8a8a8a]">QUANTITY</span>
              <div className="flex items-center border border-[#2e2e2e] rounded-lg">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 text-white text-lg cursor-pointer"
                >
                  -
                </button>
                <span className="w-10 text-center text-white">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity((q) => Math.min(pack.packStockQty, q + 1))
                  }
                  className="w-9 h-9 text-white text-lg cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          )}
          <div className="flex gap-4 mt-2">
            <button
              disabled={outOfStock}
              onClick={addToCart}
              className="h-11 px-8 rounded-lg border border-[#00ff66] text-[#00ff66] text-xs font-semibold hover:bg-[#00ff66] hover:text-black duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ADD PACK TO CART
            </button>
            <button
              disabled={outOfStock}
              onClick={buyNow}
              className="h-11 px-8 rounded-lg bg-[#00ff66] text-black text-xs font-semibold hover:bg-white duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              BUY NOW
            </button>
          </div>
        </div>
      </div>
      {stickers.length > 0 && (
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-white mb-8">
            STICKERS IN THIS PACK
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stickers.map((item) => (
              <StickerCard
                key={item._id}
                id={item._id}
                stickerImage={item.productImage}
                stickerName={item.productName}
                collectionType={item.productCategory}
                stickerPrice={item.productPrice}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
