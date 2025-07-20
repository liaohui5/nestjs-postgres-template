import { z } from "zod";

export const configSchema = z.object({
  isDev: z.boolean().default(false).optional(),
  timezone: z.string().default("Asia/Shanghai").optional(),
});

export type ConfigType = z.infer<typeof configSchema>;
export type PartialConfigType = Partial<ConfigType>;
