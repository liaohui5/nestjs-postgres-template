import { defineConfig } from "drizzle-kit";
import { configFactory } from "./src/config/config.provider";

const config = configFactory();

export const DB_URL = <string>config.get("DB_URL");
export default defineConfig({
  out: "./src/db/migrations",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: DB_URL,
  },
});
