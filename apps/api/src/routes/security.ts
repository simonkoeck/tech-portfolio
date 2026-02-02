import { createRoute, z } from "@hono/zod-openapi";
import { OpenAPIHono } from "@hono/zod-openapi";
import {
  CVESchema,
  BugBountySchema,
  SecurityQuerySchema,
  type CVE,
  type BugBounty,
} from "../schemas/security.js";
import securityData from "../data/security.json";

const app = new OpenAPIHono();

const cves: CVE[] = securityData.cves as CVE[];
const bugBounties: BugBounty[] = securityData.bugBounties as BugBounty[];

// GET /security/cves - List all CVEs
const listCVEsRoute = createRoute({
  method: "get",
  path: "/security/cves",
  tags: ["Security"],
  summary: "List all CVEs",
  description: "Returns a list of CVEs discovered by Simon",
  request: {
    query: SecurityQuerySchema,
  },
  responses: {
    200: {
      description: "List of CVEs",
      content: {
        "application/json": {
          schema: z.array(CVESchema),
        },
      },
    },
  },
});

app.openapi(listCVEsRoute, (c) => {
  const { severity } = c.req.valid("query");

  let filtered = [...cves];

  if (severity) {
    filtered = filtered.filter((cve) => cve.severity === severity);
  }

  return c.json(filtered);
});

// GET /security/cves/:id - Get single CVE
const getCVERoute = createRoute({
  method: "get",
  path: "/security/cves/{id}",
  tags: ["Security"],
  summary: "Get a CVE by ID",
  description: "Returns a single CVE by its ID",
  request: {
    params: z.object({
      id: z.string().openapi({ example: "CVE-2026-24472" }),
    }),
  },
  responses: {
    200: {
      description: "CVE found",
      content: {
        "application/json": {
          schema: CVESchema,
        },
      },
    },
    404: {
      description: "CVE not found",
      content: {
        "application/json": {
          schema: z.object({
            error: z.string().openapi({ example: "CVE not found" }),
          }),
        },
      },
    },
  },
});

app.openapi(getCVERoute, (c) => {
  const { id } = c.req.valid("param");
  const cve = cves.find((c) => c.id === id);

  if (!cve) {
    return c.json({ error: "CVE not found" }, 404);
  }

  return c.json(cve, 200);
});

// GET /security/bug-bounties - List all bug bounties
const listBugBountiesRoute = createRoute({
  method: "get",
  path: "/security/bug-bounties",
  tags: ["Security"],
  summary: "List all bug bounty findings",
  description: "Returns a list of bug bounty findings",
  request: {
    query: SecurityQuerySchema,
  },
  responses: {
    200: {
      description: "List of bug bounty findings",
      content: {
        "application/json": {
          schema: z.array(BugBountySchema),
        },
      },
    },
  },
});

app.openapi(listBugBountiesRoute, (c) => {
  const { severity } = c.req.valid("query");

  let filtered = [...bugBounties];

  if (severity) {
    filtered = filtered.filter((bb) => bb.severity === severity);
  }

  return c.json(filtered);
});

// GET /security/bug-bounties/:id - Get single bug bounty
const getBugBountyRoute = createRoute({
  method: "get",
  path: "/security/bug-bounties/{id}",
  tags: ["Security"],
  summary: "Get a bug bounty finding by ID",
  description: "Returns a single bug bounty finding by its ID",
  request: {
    params: z.object({
      id: z.string().openapi({ example: "bb-linktree-2025" }),
    }),
  },
  responses: {
    200: {
      description: "Bug bounty found",
      content: {
        "application/json": {
          schema: BugBountySchema,
        },
      },
    },
    404: {
      description: "Bug bounty not found",
      content: {
        "application/json": {
          schema: z.object({
            error: z.string().openapi({ example: "Bug bounty not found" }),
          }),
        },
      },
    },
  },
});

app.openapi(getBugBountyRoute, (c) => {
  const { id } = c.req.valid("param");
  const bugBounty = bugBounties.find((bb) => bb.id === id);

  if (!bugBounty) {
    return c.json({ error: "Bug bounty not found" }, 404);
  }

  return c.json(bugBounty, 200);
});

// GET /security/stats - Get security stats
const securityStatsRoute = createRoute({
  method: "get",
  path: "/security/stats",
  tags: ["Security"],
  summary: "Get security research statistics",
  description: "Returns statistics about security research",
  responses: {
    200: {
      description: "Security statistics",
      content: {
        "application/json": {
          schema: z.object({
            totalCVEs: z.number().openapi({ example: 2 }),
            totalBugBounties: z.number().openapi({ example: 1 }),
            criticalFindings: z.number().openapi({ example: 2 }),
            highFindings: z.number().openapi({ example: 1 }),
          }),
        },
      },
    },
  },
});

app.openapi(securityStatsRoute, (c) => {
  const allFindings = [
    ...cves.map((c) => c.severity),
    ...bugBounties.map((b) => b.severity),
  ];

  return c.json({
    totalCVEs: cves.length,
    totalBugBounties: bugBounties.length,
    criticalFindings: allFindings.filter((s) => s === "critical").length,
    highFindings: allFindings.filter((s) => s === "high").length,
  });
});

export default app;
