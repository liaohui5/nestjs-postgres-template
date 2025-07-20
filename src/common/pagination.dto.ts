import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const PaginationSchema = z.object({
  page: z.number().min(1),
  limit: z.number().min(10).max(50),
});

export class PaginationDto extends createZodDto(PaginationSchema) {}
