import { supabase } from "../../lib/supabase.ts";
import { addDays } from "date-fns";

export async function getUserTrialQuotesHelper(
  userId: string,
): Promise<boolean> {
  const startDate = new Date();
  const endDate = addDays(startDate, 1);

  const { error, count } = await supabase
    .from("alert")
    .select("*")
    .eq("author_id", userId)
    .gte("created_at", startDate.toISOString())
    .lte("created_at", endDate.toISOString());

  if (error) {
    throw new Error("Error getting user trial quotes");
  }

  return count ? count < 4 : true;
}
