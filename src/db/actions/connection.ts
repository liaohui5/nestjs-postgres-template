import { DB_URL } from "drizzle.config";
import { drizzle } from "drizzle-orm/node-postgres";

export const connection = drizzle(DB_URL);
