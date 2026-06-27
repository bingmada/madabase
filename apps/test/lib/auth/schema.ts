import { z } from "zod";

export const emailSchema = z.object({
  email: z.string().email(),
});

export const verifyCodeSchema = z.object({
  email: z.string().email(),
  code: z.string().min(6).max(6),
});
