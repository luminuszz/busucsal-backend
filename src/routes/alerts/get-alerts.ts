import { supabase } from "../../lib/supabase.ts";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

export const getAlertsSchemaParamsSchema = z.object({
  page: z.number().int().positive().default(1),
});

export async function getAlertsRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/alerts",
    {
      schema: {
        params: getAlertsSchemaParamsSchema,
      },
    },

    async ({ params }, reply) => {
      const limit = 10;

      const offset = (params.page - 1) * limit;

      const { data, error } = await supabase
        .from("alert")
        .select("*")
        .range(offset, offset + limit - 1);

      if (error) {
        reply.code(500).send({ message: error.message });
        return;
      } else {
        const alerts = data.map((alert) => ({
          title: alert.title,
          description: alert.description,
          type: alert.type,
          id: alert.id,
        }));

        reply.status(200).send(alerts);
      }
    },
  );
}
