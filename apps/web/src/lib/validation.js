import { z } from "zod";
import { supportedLanguages } from "@challenge/contracts";

export const promptSchema = z.object({
  prompt: z.string().trim().min(5, "Please provide more details"),
  targetLanguage: z.enum(supportedLanguages),
  contextId: z.string().uuid().optional().or(z.literal("")),
});
