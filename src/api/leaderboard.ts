import { supabase } from "../lib/supabase";

export async function fetchLeaderboard() {
  const { data, error } = await supabase
    .from("eco_points")
    .select(`
      points,
      user_id,
      profiles ( full_name, college_name )
    `)
    .order("points", { ascending: false })
    .limit(10);

  if (error) throw error;

  return (data || []).map((row: any) => {
    const profile = Array.isArray(row.profiles)
      ? row.profiles[0]        
      : row.profiles;

    return {
      points: row.points,
      user_id: row.user_id,
      profiles: profile
        ? {
            full_name: profile.full_name,
            college_name: profile.college_name,
          }
        : undefined,
    };
  });
}
