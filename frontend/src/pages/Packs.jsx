import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { isLoggedIn } from "../auth";
import PackCard from "../cards/PackCard";

export default function Packs() {
  const navigate = useNavigate();
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPacks = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/packs");
        setPacks(res.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load packs");
      } finally {
        setLoading(false);
      }
    };
    fetchPacks();
  }, []);

  const addToCart = async (id) => {
    if (!isLoggedIn()) {
      alert("Please log in to add items to your cart.");
      return navigate("/login");
    }
    try {
      await api.post("/cart/add", { packId: id, quantity: 1 });
      alert("Pack added to cart!");
    } catch (error) {
      alert(error.response?.data?.message || "Could not add to cart");
    }
  };

  if (loading) {
    return (
      <div className="w-screen min-h-screen bg-[#111111] flex items-center justify-center text-[#8a8a8a]">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-screen min-h-screen bg-[#111111] flex flex-col items-center justify-center gap-4">
        <span className="text-red-500 text-sm">{error}</span>
        <button
          onClick={() => window.location.reload()}
          className="h-10 px-6 rounded-lg bg-[#00ff66] text-black text-xs font-semibold cursor-pointer"
        >
          RETRY
        </button>
      </div>
    );
  }

  const visible = packs.filter((p) => p.packStatus === "available");

  return (
    <div className="w-screen min-h-screen bg-[#111111] pt-6 pb-12 md:pt-12 md:pb-12 px-4 md:px-16">
      <div className="flex flex-col w-full">
        <div className="flex flex-col mb-8">
          <span className="text-xl sm:text-2xl text-white font-semibold">STICKER PACKS</span>
          <span className="text-xs text-[#515151]">
            Grab a curated pack — multiple stickers, one click, no picking required.
          </span>
        </div>
        {visible.length === 0 ? (
          <div className="flex flex-col items-start gap-4 mt-10">
            <span className="text-[#8a8a8a] text-sm">
              No packs available yet. Check back soon!
            </span>
            <button
              onClick={() => navigate("/marketplace")}
              className="h-10 px-6 rounded-lg bg-[#00ff66] text-black text-xs font-semibold cursor-pointer"
            >
              BROWSE STICKERS
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
            {visible.map((item) => (
              <PackCard
                key={item._id || item.id}
                id={item._id || item.id}
                packImage={item.packImage}
                packName={item.packName || "Untitled Pack"}
                stickerCount={item.packProducts?.length || 0}
                packPrice={item.packPrice ?? 0}
                onAddToCart={
                  item.packStockQty <= 0 || item.packStatus === "unavailable"
                    ? undefined
                    : addToCart
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
