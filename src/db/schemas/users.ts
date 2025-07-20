import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial().primaryKey(),
  nickname: varchar({ length: 32 }),
  email: varchar({ length: 64 }).notNull().unique(),
  password: varchar({ length: 128 }).notNull(),
  telephone: varchar({ length: 16 }).unique(),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow(),
});
