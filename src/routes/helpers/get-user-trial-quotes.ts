import { supabase } from "../../lib/supabase.ts";
import { addDays } from "date-fns";
import type { ResponseType } from "../../utils/constants.ts";

type GetUserTrialQuotesResponse = ResponseType<Error, boolean>;

export async function getUserTrialQuotesHelper(
  userId: string,
): Promise<GetUserTrialQuotesResponse> {
  const startDate = new Date();
  const endDate = addDays(startDate, 1);

  const { error, count } = await supabase
    .from("alert")
    .select("*")
    .eq("author_id", userId)
    .gte("created_at", startDate.toISOString())
    .lte("created_at", endDate.toISOString());

  if (error) {
    return { error: new Error(error.message), result: null };
  }

  return {
    result: count ? count < 4 : true,
    error: null,
  };
}
