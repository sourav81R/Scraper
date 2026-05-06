const { z } = require("zod");

const storyQuerySchema = z.object({
  body: z.object({}).default({}),
  params: z.object({}).default({}),
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(20).default(10),
    search: z.string().trim().max(100).optional().default(""),
    domain: z.string().trim().max(120).optional().default(""),
    sortBy: z
      .enum(["points", "recent", "comments", "title"])
      .optional()
      .default("points"),
    order: z.enum(["asc", "desc"]).optional().default("desc"),
  }),
});

const storyIdParamsSchema = z.object({
  body: z.object({}).default({}),
  query: z.object({}).default({}),
  params: z.object({
    id: z.string().trim().min(1),
  }),
});

module.exports = { storyIdParamsSchema, storyQuerySchema };
