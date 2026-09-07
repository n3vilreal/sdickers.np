import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const BUCKET = "product-images";
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const uploadProductImage = async (file) => {
  if (!file) return "";
  if (!file.type.startsWith("image/")) {
    throw new Error("Please select an image file (jpg, png, webp)");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Image is too large. Maximum size is 5MB.");
  }
  const ext = file.name.split(".").pop().toLowerCase();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, file, { upsert: false, contentType: file.type });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
  return data.publicUrl;
};
