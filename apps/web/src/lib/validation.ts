import { z } from "zod";
import { supportedLanguages } from "@challenge/contracts";

export const promptSchema = z.object({
  prompt: z.string().trim().min(1, "Prompt is required"),
  targetLanguage: z.enum(supportedLanguages),
  contextId: z.string().uuid().optional().or(z.literal("")),
});

export type PromptFormValues = z.infer<typeof promptSchema>;
