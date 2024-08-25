import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import fastifyCors from "@fastify/cors";
import { env } from "./utils/env.ts";
import { createAlert } from "./routes/alerts/create-alert.ts";
import { getAlertsRoute } from "./routes/alerts/get-alerts.ts";
import { signRoute } from "./routes/auth/sign.ts";
import { signupRoute } from "./routes/auth/signup.ts";
import { fetchImportantAlertsInDay } from "./routes/alerts/fetch-important-alerts-in-day.ts";

const app = fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(fastifyCors, { origin: ["http://localhost:3000"] });

app.decorateRequest("user", null);

app.register(signupRoute);
app.register(signRoute);
app.register(createAlert);
app.register(getAlertsRoute);
app.register(fetchImportantAlertsInDay);

app.listen({ port: env.API_PORT, host: "0.0.0" }).then((address) => {
  console.log(`Server listening at ${address}`);
});
