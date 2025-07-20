import { createZodDto } from "nestjs-zod";
import z from "zod";

export const createUserSchema = z.object({
  nickname: z.string().max(36).optional(),
  email: z.string().email(),
  password: z.string().min(6),
});
export const updateUserSchema = createUserSchema.partial();

export class CreateUserDto extends createZodDto(createUserSchema) {}
export class UpdateUserDto extends createZodDto(updateUserSchema) {}
