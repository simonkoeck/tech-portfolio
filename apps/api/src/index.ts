import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import projectsRoutes from "./routes/projects.js";
import healthRoutes from "./routes/health.js";

const app = new OpenAPIHono();

// Enable CORS
app.use("/*", cors());

// Register routes
app.route("/", projectsRoutes);
app.route("/", healthRoutes);

// OpenAPI documentation endpoint
app.doc("/doc", (c) => {
  const url = new URL(c.req.url);
  const isDev = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  return {
    openapi: "3.1.0",
    info: {
      title: "Portfolio API",
      version: "1.0.0",
      description: "RESTful API for Simon Köck's portfolio projects",
    },
    servers: isDev
      ? [{ url: `http://${url.host}`, description: "Development" }]
      : [{ url: "https://api.simonkoeck.com", description: "Production" }],
  };
});

export default app;
