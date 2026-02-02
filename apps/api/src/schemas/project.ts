import { z } from "@hono/zod-openapi";

export const ProjectSchema = z
  .object({
    id: z.string().openapi({ example: "portfolio-api" }),
    title: z.string().openapi({ example: "Portfolio API" }),
    description: z.string().openapi({
      example: "RESTful API for portfolio projects with OpenAPI documentation",
    }),
    techStack: z.array(z.string()).openapi({
      example: ["TypeScript", "Hono", "Zod", "OpenAPI"],
    }),
    category: z
      .enum(["web", "api", "cli", "library", "mobile", "other"])
      .openapi({ example: "api" }),
    status: z
      .enum(["completed", "in-progress", "archived", "concept"])
      .openapi({ example: "completed" }),
    featured: z.boolean().openapi({ example: true }),
    links: z
      .object({
        github: z.string().url().optional().openapi({
          example: "https://github.com/simonkoeck/portfolio-api",
        }),
        live: z.string().url().optional(),
        demo: z.string().url().optional(),
      })
      .openapi({ example: { github: "https://github.com/simonkoeck/portfolio-api" } }),
    dates: z
      .object({
        started: z.string().openapi({ example: "2024-01-15" }),
        completed: z.string().optional().openapi({ example: "2024-02-01" }),
        lastUpdated: z.string().optional(),
      })
      .openapi({ example: { started: "2024-01-15", completed: "2024-02-01" } }),
    highlights: z.array(z.string()).openapi({
      example: [
        "Type-safe routes with Zod validation",
        "Automatic OpenAPI spec generation",
      ],
    }),
    order: z.number().openapi({ example: 1 }),
  })
  .openapi("Project");

export type Project = z.infer<typeof ProjectSchema>;

export const ProjectsQuerySchema = z.object({
  tech: z.string().optional().openapi({
    description: "Filter by technology in tech stack",
    example: "TypeScript",
  }),
  category: z
    .enum(["web", "api", "cli", "library", "mobile", "other"])
    .optional()
    .openapi({ description: "Filter by category" }),
  status: z
    .enum(["completed", "in-progress", "archived", "concept"])
    .optional()
    .openapi({ description: "Filter by status" }),
  featured: z
    .string()
    .optional()
    .openapi({ description: "Filter by featured status (true/false)" }),
});
