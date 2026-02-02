import { createRoute, z } from "@hono/zod-openapi";
import { OpenAPIHono } from "@hono/zod-openapi";
import { ProjectSchema, ProjectsQuerySchema, type Project } from "../schemas/project.js";
import projectsData from "../data/projects.json";

const app = new OpenAPIHono();

const projects: Project[] = projectsData as Project[];

// GET /projects - List all projects with optional filtering
const listProjectsRoute = createRoute({
  method: "get",
  path: "/projects",
  tags: ["Projects"],
  summary: "List all projects",
  description: "Returns a list of all projects with optional filtering",
  request: {
    query: ProjectsQuerySchema,
  },
  responses: {
    200: {
      description: "List of projects",
      content: {
        "application/json": {
          schema: z.array(ProjectSchema),
        },
      },
    },
  },
});

app.openapi(listProjectsRoute, (c) => {
  const { tech, category, status, featured } = c.req.valid("query");

  let filtered = [...projects];

  if (tech) {
    filtered = filtered.filter((p) =>
      p.techStack.some((t) => t.toLowerCase().includes(tech.toLowerCase()))
    );
  }

  if (category) {
    filtered = filtered.filter((p) => p.category === category);
  }

  if (status) {
    filtered = filtered.filter((p) => p.status === status);
  }

  if (featured !== undefined) {
    const isFeatured = featured === "true";
    filtered = filtered.filter((p) => p.featured === isFeatured);
  }

  filtered.sort((a, b) => a.order - b.order);

  return c.json(filtered);
});

// GET /projects/featured - Get featured projects
const featuredProjectsRoute = createRoute({
  method: "get",
  path: "/projects/featured",
  tags: ["Projects"],
  summary: "Get featured projects",
  description: "Returns a list of featured projects",
  responses: {
    200: {
      description: "List of featured projects",
      content: {
        "application/json": {
          schema: z.array(ProjectSchema),
        },
      },
    },
  },
});

app.openapi(featuredProjectsRoute, (c) => {
  const featured = projects.filter((p) => p.featured).sort((a, b) => a.order - b.order);
  return c.json(featured);
});

// GET /projects/:id - Get single project
const getProjectRoute = createRoute({
  method: "get",
  path: "/projects/{id}",
  tags: ["Projects"],
  summary: "Get a project by ID",
  description: "Returns a single project by its ID",
  request: {
    params: z.object({
      id: z.string().openapi({ example: "portfolio-api" }),
    }),
  },
  responses: {
    200: {
      description: "Project found",
      content: {
        "application/json": {
          schema: ProjectSchema,
        },
      },
    },
    404: {
      description: "Project not found",
      content: {
        "application/json": {
          schema: z.object({
            error: z.string().openapi({ example: "Project not found" }),
          }),
        },
      },
    },
  },
});

app.openapi(getProjectRoute, (c) => {
  const { id } = c.req.valid("param");
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return c.json({ error: "Project not found" }, 404);
  }

  return c.json(project, 200);
});

export default app;
