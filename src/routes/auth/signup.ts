import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { supabase } from "../../lib/supabase.ts";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string(),
});

export async function signupRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "signup",
    {
      schema: {
        body: signupSchema,
      },
    },
    async ({ body }, reply) => {
      const { email, password, name } = body;

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      const userAlreadyExists = error?.code === "user_already_exists";

      if (userAlreadyExists) {
        return reply.code(409).send({ message: "User already exists" });
      }

      if (error) {
        return reply.code(400).send({ message: error.message });
      }

      return reply.code(201).send({ message: "User created" });
    },
  );
}
