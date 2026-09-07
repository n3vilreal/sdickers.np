import React from "react";
import { useNavigate } from "react-router-dom";
const PLACEHOLDER =
  "https://placehold.co/300x300/181818/00ff66?text=Sticker";
export default function StickerCard({
  id,
  stickerImage,
  stickerName,
  collectionType,
  stickerPrice,
  onAddToCart,
}) {
  const navigate = useNavigate();
  const goToDetail = () => {
    if (id) navigate(`/product/${id}`);
  };
  return (
    <div className="flex flex-col w-full rounded-2xl overflow-hidden border-2 border-[#2e2e2e] bg-[#181818] hover:shadow-[0_0_12px_rgba(0,255,102,0.9)] hover:border-transparent hover:scale-105 duration-300">
      <div
        className="bg-white p-6 flex items-center justify-center h-64 cursor-pointer"
        onClick={goToDetail}
      >
        <img
          src={stickerImage || PLACEHOLDER}
          alt={stickerName}
          onError={(e) => {
            e.currentTarget.src = PLACEHOLDER;
          }}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="p-5 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <span
            className="text-white font-semibold text-lg flex-1 truncate cursor-pointer"
            title={stickerName}
            onClick={goToDetail}
          >
            {stickerName}
          </span>
          <span className="text-[#00ff66] font-bold text-base flex-shrink-0">
            Rs. {stickerPrice}
          </span>
        </div>
        <span className="text-xs text-[#8a8a8a] uppercase tracking-wide">
          Collection: {collectionType}
        </span>
        {onAddToCart && (
          <button
            onClick={() => onAddToCart(id)}
            className="mt-2 h-9 rounded-lg bg-[#00ff66] text-black text-xs font-semibold hover:bg-white duration-300 cursor-pointer"
          >
            ADD TO CART
          </button>
        )}
      </div>
    </div>
  );
}
