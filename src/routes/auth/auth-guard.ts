import type { FastifyReply, FastifyRequest } from "fastify";
import { supabase } from "../../lib/supabase.ts";

export interface UserPayload {
  id: string;
  email: string;
}

export async function checksUserGuard(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { authorization } = request.headers;

  if (!authorization) {
    return reply.status(401).send({ message: "Unauthorized" });
  }

  const token = authorization.split(" ")[1];

  const { data, error } = await supabase.auth.getUser(token);

  if (error) {
    return reply.status(401).send({ message: "Unauthorized" });
  }

  const userPayload = {
    email: data.user.email ?? "",
    id: data.user.id,
  } satisfies UserPayload;

  console.log(userPayload);

  request.user = userPayload;
}
