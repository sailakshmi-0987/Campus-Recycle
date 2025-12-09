import { supabase } from "../lib/supabase";

export async function fetchMessages(threadId: number) {
  const { data, error } = await supabase
    .from("chat_messages")
    .select(`
      id,
      thread_id,
      sender_id,
      message,
      is_read,
      created_at,
      profiles:profiles ( full_name )
    `)
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data || [];
}


export async function sendMessage(thread_id: number, sender_id: string, message: string) {
  const { data, error } = await supabase
    .from("chat_messages")
    .insert({ thread_id, sender_id, message })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function markThreadRead(threadId: number, userId: string) {
  const { error } = await supabase
    .from("chat_messages")
    .update({ is_read: true })
    .eq("thread_id", threadId)
    .neq("sender_id", userId);

  if (error) throw error;
  return true;
}
