import { z } from "@hono/zod-openapi";

export const CVESchema = z
  .object({
    id: z.string().openapi({ example: "CVE-2026-24472" }),
    title: z.string().openapi({ example: "Cache Control Bypass in Hono" }),
    description: z.string().openapi({
      example: "Information disclosure vulnerability caused by improper handling of HTTP cache control directives.",
    }),
    severity: z.enum(["critical", "high", "medium", "low"]).openapi({ example: "high" }),
    cvss: z.number().optional().openapi({ example: 7.5 }),
    product: z.string().openapi({ example: "hono" }),
    vendor: z.string().openapi({ example: "honojs" }),
    affectedVersions: z.string().openapi({ example: "< 4.11.7" }),
    fixedVersion: z.string().optional().openapi({ example: "4.11.7" }),
    publishedAt: z.string().openapi({ example: "2026-01-27" }),
    references: z.array(z.string()).openapi({
      example: ["https://nvd.nist.gov/vuln/detail/CVE-2026-24472"],
    }),
  })
  .openapi("CVE");

export const BugBountySchema = z
  .object({
    id: z.string().openapi({ example: "bb-linktree-2025" }),
    title: z.string().openapi({ example: "Critical Vulnerability in Linktree" }),
    description: z.string().openapi({
      example: "Discovered and reported a critical security vulnerability.",
    }),
    company: z.string().openapi({ example: "Linktree" }),
    severity: z.enum(["critical", "high", "medium", "low"]).openapi({ example: "critical" }),
    cvss: z.number().optional().openapi({ example: 10.0 }),
    status: z.enum(["reported", "triaged", "resolved", "published"]).openapi({ example: "resolved" }),
    reportedAt: z.string().openapi({ example: "2025-01-15" }),
    resolvedAt: z.string().optional().openapi({ example: "2025-02-01" }),
    bounty: z.string().optional().openapi({ example: "$5,000" }),
  })
  .openapi("BugBounty");

export const SecurityQuerySchema = z.object({
  severity: z.enum(["critical", "high", "medium", "low"]).optional().openapi({
    param: { name: "severity", in: "query" },
    example: "critical",
  }),
});

export type CVE = z.infer<typeof CVESchema>;
export type BugBounty = z.infer<typeof BugBountySchema>;
