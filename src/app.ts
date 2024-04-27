import fastify from "fastify";
import { mealsRoutes } from "./routes/mealsRoutes";
import cookie from '@fastify/cookie'
import { userRoutes } from "./routes/user";
import { metricsRoutes } from "./routes/metrics";

const app = fastify();

app.register(cookie)

app.register(mealsRoutes, {
    prefix: '/meal'
})

app.register(userRoutes, {
    prefix: '/user'
})

app.register(metricsRoutes)

app.listen({ port: 8000 }).then(() => {
  console.log("Server is running on port 8000");
});
