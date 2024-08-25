import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { checksUserGuard } from "../auth/auth-guard.ts";
import { supabase } from "../../lib/supabase.ts";
import { endOfDay, startOfDay } from "date-fns";
import { groupBy } from "lodash";
import type { AlertType } from "../../utils/constants.ts";

export interface Alert {
  title: string;
  description: string;
  type: AlertType;
  id: string;
}

export async function fetchImportantAlertsInDay(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .addHook("preHandler", checksUserGuard)
    .get("/alerts/important", async (_, reply) => {
      const today = new Date();

      const startDate = startOfDay(today);
      const endDate = endOfDay(today);

      const { error, data } = await supabase
        .from("alert")
        .select("type, created_at")
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString());

      if (error) {
        return reply.code(500).send({ message: error.message });
      }

      const groupedAlertsByType = groupBy(data, "type");

      return reply.status(200).send(groupedAlertsByType);
    });
}
