import { supabase } from "../lib/supabase";

export async function fetchLostFound(kind?: "lost" | "found") {
  let q = supabase.from("lost_found").select("*").order("created_at", { ascending: false });
  if (kind) q = q.eq("kind", kind);
  const { data, error } = await q;
  if (error) throw error;
  return data || [];
}

export async function createLostFound(payload: {
  user_id: string;
  title: string;
  description?: string;
  image_url?: string;
  location?: string;
  kind: "lost" | "found";
}) {
  const { data, error } = await supabase
    .from("lost_found")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateLostFoundStatus(id: number, status: "open" | "returned" | "resolved") {
  const { data, error } = await supabase.from("lost_found").update({ status }).eq("id", id).select().single();
  if (error) throw error;
  return data;
}
