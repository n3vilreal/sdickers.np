import React from "react";
import { useNavigate } from "react-router-dom";
const PLACEHOLDER =
  "https://placehold.co/300x300/181818/00ff66?text=Pack";
const STICKER_PLACEHOLDER =
  "https://placehold.co/64x64/181818/00ff66?text=S";
export default function PackCard({
  id,
  packImage,
  packName,
  packProducts = [],
  stickerCount,
  packPrice,
  packStatus,
  onAddToCart,
}) {
  const navigate = useNavigate();
  const goToDetail = () => {
    if (id) navigate(`/pack/${id}`);
  };
  const outOfStock = packStatus === "unavailable" || stickerCount <= 0;
  const contents = packProducts.slice(0, 4);
  const remaining = packProducts.length - contents.length;
  return (
    <div className="flex flex-col w-full rounded-2xl overflow-hidden border-2 border-[#2e2e2e] bg-[#181818] hover:shadow-[0_0_12px_rgba(0,255,102,0.9)] hover:border-transparent hover:scale-105 duration-300">
      <div
        className="bg-white p-6 flex items-center justify-center h-64 cursor-pointer relative"
        onClick={goToDetail}
      >
        <img
          src={packImage || PLACEHOLDER}
          alt={packName}
          onError={(e) => {
            e.currentTarget.src = PLACEHOLDER;
          }}
          className="w-full h-full object-contain"
        />
        <span className="absolute top-3 left-3 bg-[#00ff66] text-black text-[10px] font-bold px-3 py-1 rounded-full">
          PACK
        </span>
        {outOfStock && (
          <span className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-full">
            OUT OF STOCK
          </span>
        )}
      </div>
      <div className="p-5 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <span
            className="text-white font-semibold text-lg flex-1 truncate cursor-pointer"
            title={packName}
            onClick={goToDetail}
          >
            {packName}
          </span>
          <span className="text-[#00ff66] font-bold text-base flex-shrink-0">
            Rs. {packPrice}
          </span>
        </div>
        <span className="text-xs text-[#8a8a8a] uppercase tracking-wide">
          {stickerCount} sticker{stickerCount === 1 ? "" : "s"} included
        </span>
        {contents.length > 0 && (
          <div className="flex items-center gap-2 mt-1">
            {contents.map((p) => (
              <div
                key={p._id || p.id}
                className="w-12 h-12 bg-white rounded-lg p-1 flex items-center justify-center border border-[#2e2e2e]"
                title={p.productName}
              >
                <img
                  src={p.productImage || STICKER_PLACEHOLDER}
                  alt={p.productName}
                  onError={(e) => {
                    e.currentTarget.src = STICKER_PLACEHOLDER;
                  }}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
            {remaining > 0 && (
              <span className="text-[10px] text-[#8a8a8a] font-semibold">
                +{remaining} more
              </span>
            )}
          </div>
        )}
        {onAddToCart && (
          <button
            onClick={() => onAddToCart(id)}
            className="mt-2 h-9 rounded-lg bg-[#00ff66] text-black text-xs font-semibold hover:bg-white duration-300 cursor-pointer"
          >
            ADD PACK TO CART
          </button>
        )}
      </div>
    </div>
  );
}
