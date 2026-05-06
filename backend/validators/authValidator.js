const { z } = require("zod");

const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(60),
    email: z.string().trim().email(),
    password: z.string().min(6).max(128),
  }),
  query: z.object({}).default({}),
  params: z.object({}).default({}),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email(),
    password: z.string().min(6).max(128),
  }),
  query: z.object({}).default({}),
  params: z.object({}).default({}),
});

const googleLoginSchema = z.object({
  body: z.object({
    idToken: z.string().min(20),
  }),
  query: z.object({}).default({}),
  params: z.object({}).default({}),
});

module.exports = { googleLoginSchema, loginSchema, registerSchema };
