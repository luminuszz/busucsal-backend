import type { UserPayload } from "../routes/auth/auth-guard.ts";

declare module "fastify" {
  export interface FastifyRequest {
    user: UserPayload;
  }

  export interface FastifyInstance {
    getCurrentUser(): Promise<UserPayload>;
  }
}
