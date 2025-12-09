import { supabase } from "../lib/supabase";

export async function sendNotification(
  userId: string,
  type: string,
  title: string,
  message: string
) {
  const { error } = await supabase.from("notifications").insert({
    user_id: userId,
    type,
    title,
    message,
    is_read: false, 
  });

  if (error) {
    console.error("Notification error:", error);
    throw error;
  }

  return true;
}
