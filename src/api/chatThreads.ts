import { supabase } from "../lib/supabase";

export async function getOrCreateThread(params: {
  itemId?: string | null;
  lostFoundId?: string | null;
  requesterId: string;
  ownerId: string;
}) {
  const { itemId, lostFoundId, requesterId, ownerId } = params;

  const { data, error } = await supabase.rpc("get_or_create_thread", {
    p_item_id: itemId ? Number(itemId) : null,
    p_lost_found_id: lostFoundId ? Number(lostFoundId) : null,
    p_requester_id: requesterId,
    p_owner_id: ownerId,
  });

  if (error) {
    console.error("RPC get_or_create_thread error:", error);
    throw error;
  }

  return data;
}

export async function fetchUserThreads(userId: string) {
  const { data, error } = await supabase
    .from("chat_threads")
    .select(`
      id,
      item_id,
      lost_found_id,
      owner_id,
      requester_id,
      created_at,

      items:item_id (
        id,
        title,
        image_url
      ),

      lost_found:lost_found_id (
        id,
        title,
        image_url
      ),

      owner:profiles!chat_threads_owner_id_fkey (
        id,
        full_name
      ),

      requester:profiles!chat_threads_requester_id_fkey (
        id,
        full_name
      ),

      chat_messages:chat_messages (
        id,
        message,
        sender_id,
        created_at,
        is_read
      )
    `)
    .or(`owner_id.eq.${userId},requester_id.eq.${userId}`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("fetchUserThreads error:", error);
    throw error;
  }

  return (data || []).map((thread: any) => {
    const msgs = thread.chat_messages || [];
    const lastMsg = msgs[msgs.length - 1] || null;
    const unread = msgs.filter(
      (m: any) => m.sender_id !== userId && !m.is_read
    ).length;

    return { ...thread, lastMsg, unread };
  });
}


export async function fetchThread(
  itemId: string | null,
  requesterId: string,
  ownerId: string,
  lostFoundId?: string | null
) {
  return await getOrCreateThread({
    itemId: itemId ? itemId : null,
    lostFoundId: lostFoundId ? lostFoundId : null,
    requesterId,
    ownerId,
  });
}
