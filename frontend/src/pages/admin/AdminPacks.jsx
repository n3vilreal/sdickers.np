import React, { useEffect, useState } from "react";
import api from "../../api";
import { uploadProductImage } from "../../supabase";
const EMPTY = {
  packName: "",
  packDescription: "",
  packPrice: "",
  packStockQty: "",
  packStatus: "available",
  packImage: "",
};
export default function AdminPacks() {
  const [packs, setPacks] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [productIds, setProductIds] = useState([]);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const fetchData = async () => {
    setLoading(true);
    try {
      const [packsRes, productsRes] = await Promise.all([
        api.get("/packs"),
        api.get("/products"),
      ]);
      setPacks(packsRes.data.data);
      setProducts(productsRes.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY);
    setProductIds([]);
    setImageFile(null);
    setImagePreview("");
    setShowForm(true);
  };
  const openEdit = (pack) => {
    setEditingId(pack._id);
    setForm({
      packName: pack.packName || "",
      packDescription: pack.packDescription || "",
      packPrice: pack.packPrice ?? "",
      packStockQty: pack.packStockQty ?? "",
      packStatus: pack.packStatus || "available",
      packImage: pack.packImage || "",
    });
    setProductIds((pack.packProducts || []).map((p) => p._id));
    setImageFile(null);
    setImagePreview(pack.packImage || "");
    setShowForm(true);
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const toggleProduct = (id) => {
    setProductIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };
  const save = async (e) => {
    e.preventDefault();
    if (productIds.length === 0) {
      return alert("Select at least one sticker for the pack.");
    }
    setSaving(true);
    try {
      let imageUrl = form.packImage;
      if (imageFile) {
        imageUrl = await uploadProductImage(imageFile);
      }
      const payload = {
        ...form,
        packImage: imageUrl,
        packPrice: Number(form.packPrice),
        packStockQty: Number(form.packStockQty),
        productIds,
      };
      if (editingId) {
        await api.patch(`/pack/${editingId}`, payload);
      } else {
        await api.post("/pack", payload);
      }
      setShowForm(false);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Could not save pack");
    } finally {
      setSaving(false);
    }
  };
  const remove = async (id) => {
    if (!confirm("Delete this pack?")) return;
    try {
      await api.delete(`/pack/${id}`);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Could not delete pack");
    }
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Packs</h1>
        <button
          onClick={openCreate}
          className="h-10 px-5 rounded-lg bg-[#00ff66] text-black text-xs font-semibold hover:bg-white cursor-pointer"
        >
          + ADD PACK
        </button>
      </div>
      {loading ? (
        <div className="text-[#8a8a8a] text-sm">Loading...</div>
      ) : (
        <div className="bg-[#181818] border border-[#2e2e2e] rounded-2xl overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[700px]">
            <thead className="text-[#8a8a8a] text-xs uppercase border-b border-[#2e2e2e]">
              <tr>
                <th className="p-4">Image</th>
                <th className="p-4">Name</th>
                <th className="p-4">Stickers</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {packs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-[#8a8a8a]">
                    No packs yet.
                  </td>
                </tr>
              ) : (
                packs.map((p) => (
                  <tr key={p._id} className="border-b border-[#2e2e2e]">
                    <td className="p-4">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-1">
                        <img
                          src={
                            p.packImage ||
                            "https://placehold.co/48x48/181818/00ff66?text=P"
                          }
                          alt={p.packName}
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://placehold.co/48x48/181818/00ff66?text=P";
                          }}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </td>
                    <td className="p-4 text-white">{p.packName}</td>
                    <td className="p-4 text-[#8a8a8a]">
                      {p.packProducts?.length || 0}
                    </td>
                    <td className="p-4 text-[#00ff66]">Rs. {p.packPrice}</td>
                    <td className="p-4 text-[#8a8a8a]">{p.packStockQty}</td>
                    <td className="p-4 text-[#8a8a8a]">{p.packStatus}</td>
                    <td className="p-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => openEdit(p)}
                          className="text-[#00ff66] text-xs font-semibold hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => remove(p._id)}
                          className="text-red-500 text-xs font-semibold hover:underline cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      {showForm && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setShowForm(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={save}
            className="bg-[#181818] border border-[#2e2e2e] rounded-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto flex flex-col gap-4"
          >
            <h2 className="text-xl font-bold text-white">
              {editingId ? "Edit Pack" : "Add Pack"}
            </h2>
            <Input
              label="Pack Name"
              name="packName"
              value={form.packName}
              onChange={handleChange}
              required
            />
            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-[#8a8a8a] uppercase">
                Description
              </span>
              <textarea
                name="packDescription"
                value={form.packDescription}
                onChange={handleChange}
                required
                rows={3}
                className="border border-[#2e2e2e] rounded-lg bg-[#111111] text-white px-4 py-2 text-sm outline-none focus:border-[#00ff66]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Price (Rs.)"
                name="packPrice"
                type="number"
                value={form.packPrice}
                onChange={handleChange}
                required
              />
              <Input
                label="Stock Qty"
                name="packStockQty"
                type="number"
                value={form.packStockQty}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-[#8a8a8a] uppercase">
                Pack Image
              </span>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-white rounded-xl flex items-center justify-center p-2 flex-shrink-0 border border-[#2e2e2e]">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="preview"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-[#8a8a8a] text-xs">No image</span>
                  )}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <label
                    htmlFor="pack-image-upload"
                    className="h-11 px-4 rounded-lg border border-[#2e2e2e] text-[#00ff66] text-xs font-semibold hover:border-[#00ff66] cursor-pointer flex items-center justify-center"
                  >
                    CHOOSE IMAGE FROM PC
                  </label>
                  <input
                    id="pack-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  {imageFile && (
                    <span className="text-[10px] text-[#8a8a8a] truncate">
                      {imageFile.name}
                    </span>
                  )}
                  {form.packImage && !imageFile && (
                    <button
                      type="button"
                      onClick={() => {
                        setForm({ ...form, packImage: "" });
                        setImagePreview("");
                      }}
                      className="text-red-500 text-xs font-semibold hover:underline cursor-pointer text-left w-fit"
                    >
                      Remove current image
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-[#8a8a8a] uppercase">
                Stickers in pack ({productIds.length} selected)
              </span>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-[#2e2e2e] rounded-lg p-3 bg-[#111111]">
                {products.length === 0 ? (
                  <span className="text-xs text-[#8a8a8a] col-span-2">
                    No stickers available. Create products first.
                  </span>
                ) : (
                  products.map((p) => (
                    <label
                      key={p._id}
                      className="flex items-center gap-2 text-xs text-white cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={productIds.includes(p._id)}
                        onChange={() => toggleProduct(p._id)}
                        className="accent-[#00ff66]"
                      />
                      <span className="truncate">{p.productName}</span>
                    </label>
                  ))
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-[#8a8a8a] uppercase">
                Status
              </span>
              <select
                name="packStatus"
                value={form.packStatus}
                onChange={handleChange}
                className="border border-[#2e2e2e] rounded-lg bg-[#111111] text-white px-4 h-11 text-sm outline-none focus:border-[#00ff66]"
              >
                <option value="available">available</option>
                <option value="unavailable">unavailable</option>
              </select>
            </div>
            <div className="flex gap-3 mt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 h-11 rounded-lg bg-[#00ff66] text-black text-xs font-semibold hover:bg-white cursor-pointer disabled:opacity-50"
              >
                {saving ? "SAVING..." : "SAVE"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 h-11 rounded-lg border border-[#2e2e2e] text-[#8a8a8a] text-xs font-semibold hover:text-white cursor-pointer"
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
function Input({ label, ...props }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[10px] text-[#8a8a8a] uppercase">{label}</span>
      <input
        {...props}
        className="border border-[#2e2e2e] rounded-lg h-11 bg-[#111111] text-white px-4 text-sm outline-none focus:border-[#00ff66]"
      />
    </div>
  );
}
