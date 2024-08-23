import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { supabase } from "../../lib/supabase.ts";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function signRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/auth/login",
    {
      schema: {
        body: loginSchema,
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return reply.code(401).send({ message: error.message });
      }

      return reply.code(200).send({
        refreshToken: data.session.refresh_token,
        accessToken: data.session.access_token,
      });
    },
  );
}
