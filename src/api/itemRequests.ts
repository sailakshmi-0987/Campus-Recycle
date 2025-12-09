import { supabase } from "../lib/supabase";

export async function acceptRequest(requestId: number) {
  const { data: session } = await supabase.auth.getUser();
  const userId = session?.user?.id;

  const { error } = await supabase.rpc("accept_item_request", {
    request_id: requestId,
    user_uuid: userId,
  });

  if (error) throw error;
  return true;
}

export async function completeExchange(requestId: number) {
  const { data: session } = await supabase.auth.getUser();
  const userId = session?.user?.id;

  const { error } = await supabase.rpc("complete_item_exchange", {
    request_id: requestId,
    user_uuid: userId,
  });

  if (error) throw error;
  return true;
}


