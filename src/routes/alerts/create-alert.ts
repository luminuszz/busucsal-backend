import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { AlertType } from "../../utils/alert-type.ts";
import { supabase } from "../../lib/supabase.ts";
import { checksUserGuard } from "../auth/auth-guard.ts";
import { getUserTrialQuotesHelper } from "../helpers/get-user-trial-quotes.ts";

const createAlertSchema = z.object({
  title: z.string(),
  description: z.string(),
  type: z.nativeEnum(AlertType),
});

export async function createAlert(app: FastifyInstance) {
  app
    .addHook("preHandler", checksUserGuard)
    .withTypeProvider<ZodTypeProvider>()
    .post(
      "/alerts",
      {
        schema: {
          body: createAlertSchema,
        },
      },
      async ({ user, body }, reply) => {
        const { title, type, description } = body;

        const { error, result: userCanCreateAlert } =
          await getUserTrialQuotesHelper(user.id);

        if (error) {
          return reply.code(500).send({ message: error.message });
        }

        if (!userCanCreateAlert) {
          return reply.code(400).send({
            message: "You have reached the limit of alerts you can create",
          });
        }

        const { error: databaseError } = await supabase.from("alert").insert({
          title,
          description,
          type,
          author_id: user.id,
        });

        if (databaseError) {
          reply.code(500).send({ message: databaseError.message });
        } else {
          reply.code(201).send({ message: "Alert created" });
        }
      },
    );
}
