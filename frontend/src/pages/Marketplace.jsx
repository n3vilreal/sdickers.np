import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { isLoggedIn } from "../auth";
import StickerCard from "../cards/StickerCard";

export default function Marketplace() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/products");
        setProducts(res.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = [
    "all",
    ...new Set(products.map((p) => p.productCategory).filter(Boolean)),
  ];

  const visible = products.filter((p) => {
    if (category !== "all" && p.productCategory !== category) return false;
    if (category === "all" && p.productStatus === "unavailable") return false;
    return true;
  });

  const sorted = [...visible].sort((a, b) => {
    const priceA = Number(a.productPrice) || 0;
    const priceB = Number(b.productPrice) || 0;
    if (sort === "priceAsc") return priceA - priceB;
    if (sort === "priceDesc") return priceB - priceA;
    return 0;
  });

  const addToCart = async (id) => {
    if (!isLoggedIn()) {
      alert("Please log in to add items to your cart.");
      return navigate("/login");
    }
    try {
      await api.post("/cart/add", { productId: id, quantity: 1 });
      alert("Added to cart!");
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

  return (
    <div className="w-screen min-h-screen bg-[#111111] pt-12 pb-12">
      <div className="flex w-full h-full">
        <div className="w-[15%] flex flex-col items-center gap-y-14">
          <div className="flex flex-col text-xs text-[#8a8a8a] gap-y-4 w-[60%]">
            <span className="font-semibold text-[#00ff66]">CATEGORIES</span>
            {categories.map((c) => (
              <span
                key={c}
                onClick={() => setCategory(c)}
                className={`capitalize cursor-pointer hover:text-white ${
                  category === c ? "text-[#00ff66] font-semibold" : ""
                }`}
              >
                {c === "all" ? "All" : c}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col w-[85%] px-16">
          <div className="flex justify-between w-full items-center">
            <div className="flex flex-col">
              <span className="text-2xl text-white font-semibold">SHOP ALL</span>
              <span className="text-xs text-[#515151]">
                Showing {sorted.length} sticker{sorted.length === 1 ? "" : "s"}
              </span>
            </div>
            <div className="flex justify-center items-center">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="text-white text-xs font-semibold p-3 rounded-xl border-1 border-[#2e2e2e] bg-[#181818] cursor-pointer"
              >
                <option value="">FEATURED</option>
                <option value="priceAsc">PRICE: LOW TO HIGH</option>
                <option value="priceDesc">PRICE: HIGH TO LOW</option>
              </select>
            </div>
          </div>

          {sorted.length === 0 ? (
            <div className="flex flex-col items-start gap-4 mt-10">
              <span className="text-[#8a8a8a] text-sm">
                {category === "all"
                  ? "No stickers available yet. Check back soon!"
                  : `No stickers found in "${category}".`}
              </span>
              {category !== "all" && (
                <button
                  onClick={() => setCategory("all")}
                  className="h-10 px-6 rounded-lg bg-[#00ff66] text-black text-xs font-semibold cursor-pointer"
                >
                  VIEW ALL STICKERS
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-10 mt-6">
              {sorted.map((item) => (
                <StickerCard
                  key={item._id || item.id}
                  id={item._id || item.id}
                  stickerImage={item.productImage}
                  stickerName={item.productName || "Untitled"}
                  collectionType={item.productCategory || "Uncategorized"}
                  stickerPrice={item.productPrice ?? 0}
                  onAddToCart={
                    item.productStockQty <= 0 || item.productStatus === "unavailable"
                      ? undefined
                      : addToCart
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
