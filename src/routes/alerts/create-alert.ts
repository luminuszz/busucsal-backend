import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { AlertType } from "../../utils/alert-type.ts";
import { supabase } from "../../lib/supabase.ts";
import { checksUserGuard } from "../auth/auth-guard.ts";

export async function createAlert(app: FastifyInstance) {
  app
    .addHook("preHandler", checksUserGuard)
    .withTypeProvider<ZodTypeProvider>()
    .post(
      "/alerts",
      {
        schema: {
          body: z.object({
            title: z.string(),
            description: z.string(),
            type: z.nativeEnum(AlertType),
          }),
        },
      },
      async ({ user, body }, reply) => {
        const { title, type, description } = body;

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
