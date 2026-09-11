import React, { useEffect, useState } from "react";
import api from "../../api";
import { uploadImage } from "../../supabase";

export default function AdminPayments() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingMethod, setSavingMethod] = useState(null);
  const [forms, setForms] = useState({});

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/payment-settings");
      setSettings(res.data.data);
      setForms(
        Object.fromEntries(
          res.data.data.map((s) => [
            s.method,
            {
              qrImage: s.qrImage || "",
              accountName: s.accountName || "",
              accountNumber: s.accountNumber || "",
              instructions: s.instructions || "",
            },
          ])
        )
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (method, e) => {
    setForms({
      ...forms,
      [method]: { ...forms[method], [e.target.name]: e.target.value },
    });
  };

  const handleFileChange = (method, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file (jpg, png, webp)");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setForms({
        ...forms,
        [method]: { ...forms[method], qrImagePreview: reader.result, qrFile: file },
      });
    };
    reader.readAsDataURL(file);
  };

  const save = async (method) => {
    const form = forms[method];
    if (!form) return;
    try {
      setSavingMethod(method);
      let qrImage = form.qrImage;
      if (form.qrFile) {
        qrImage = await uploadImage(form.qrFile);
      }
      await api.patch(`/payment-settings/${method}`, {
        qrImage,
        accountName: form.accountName,
        accountNumber: form.accountNumber,
        instructions: form.instructions,
      });
      fetchSettings();
    } catch (error) {
      alert(error.response?.data?.message || error.message || "Could not save");
    } finally {
      setSavingMethod(null);
    }
  };

  if (loading) {
    return <div className="text-[#8a8a8a] text-sm">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Payment Methods</h1>
      <p className="text-xs text-[#8a8a8a] mb-8">
        Upload QR codes and account details for eSewa and Khalti. Customers will
        see these at checkout when they choose these payment methods.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {settings.map((s) => {
          const form = forms[s.method] || {};
          const preview = form.qrImagePreview || form.qrImage;
          return (
            <div
              key={s._id}
              className="bg-[#181818] border border-[#2e2e2e] rounded-2xl p-6 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">{s.method}</h2>
                <span
                  className={`text-[10px] font-semibold px-2 py-1 rounded-full ${
                    preview
                      ? "bg-[#00ff66] text-black"
                      : "bg-[#2e2e2e] text-[#8a8a8a]"
                  }`}
                >
                  {preview ? "QR SET" : "NO QR"}
                </span>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-32 h-32 bg-white rounded-xl border border-[#2e2e2e] flex items-center justify-center p-2 flex-shrink-0">
                  {preview ? (
                    <img
                      src={preview}
                      alt={`${s.method} QR`}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-[#8a8a8a] text-xs text-center">
                      No QR uploaded
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <label
                    htmlFor={`qr-upload-${s.method}`}
                    className="h-10 px-4 rounded-lg border border-[#2e2e2e] text-[#00ff66] text-xs font-semibold hover:border-[#00ff66] cursor-pointer flex items-center justify-center"
                  >
                    UPLOAD QR IMAGE
                  </label>
                  <input
                    id={`qr-upload-${s.method}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(s.method, e)}
                    className="hidden"
                  />
                  {form.qrFile && (
                    <span className="text-[10px] text-[#8a8a8a] truncate">
                      {form.qrFile.name}
                    </span>
                  )}
                  {form.qrImage && !form.qrFile && (
                    <button
                      type="button"
                      onClick={() =>
                        setForms({
                          ...forms,
                          [s.method]: { ...form, qrImage: "" },
                        })
                      }
                      className="text-red-500 text-xs font-semibold hover:underline cursor-pointer text-left w-fit"
                    >
                      Remove current QR
                    </button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Account Name"
                  name="accountName"
                  value={form.accountName || ""}
                  onChange={(e) => handleChange(s.method, e)}
                  placeholder="e.g. Sdickers Store"
                />
                <Input
                  label="Account / Phone Number"
                  name="accountNumber"
                  value={form.accountNumber || ""}
                  onChange={(e) => handleChange(s.method, e)}
                  placeholder="e.g. 98XXXXXXXX"
                />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] text-[#8a8a8a] uppercase">
                  Instructions for customers
                </span>
                <textarea
                  name="instructions"
                  rows={3}
                  value={form.instructions || ""}
                  onChange={(e) => handleChange(s.method, e)}
                  placeholder="e.g. Scan the QR and send the exact total amount, then tap Place Order."
                  className="border border-[#2e2e2e] rounded-lg bg-[#111111] text-white px-4 py-2 text-sm placeholder-[#515151] outline-none focus:border-[#00ff66]"
                />
              </div>
              <button
                onClick={() => save(s.method)}
                disabled={savingMethod === s.method}
                className="h-11 rounded-lg bg-[#00ff66] text-black text-xs font-semibold hover:bg-white cursor-pointer disabled:opacity-50"
              >
                {savingMethod === s.method ? "SAVING..." : `SAVE ${s.method.toUpperCase()}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[10px] text-[#8a8a8a] uppercase">{label}</span>
      <input
        {...props}
        className="border border-[#2e2e2e] rounded-lg h-11 bg-[#111111] text-white px-4 text-sm placeholder-[#515151] outline-none focus:border-[#00ff66]"
      />
    </div>
  );
}
