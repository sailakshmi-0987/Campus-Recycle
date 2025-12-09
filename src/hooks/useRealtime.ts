import { useEffect } from "react";
import { supabase } from "../lib/supabase";

/**
 * Realtime listener for item_requests + items tables
 * @param onChange callback for updates
 * @param enabled if false -> no subscriptions
 */
export function useRealtimeItemRequests(onChange: () => void, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const itemReqSub = supabase
      .channel("item-requests-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "item_requests" },
        () => onChange()
      )
      .subscribe();

    const itemsSub = supabase
      .channel("items-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "items" },
        () => onChange()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(itemReqSub);
      supabase.removeChannel(itemsSub);
    };
  }, [enabled, onChange]);
}
