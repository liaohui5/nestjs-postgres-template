import { configFactory } from "../src/config/config.provider";
import { ConnectionManager } from "../src/db/db.provider";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { setDb } from "./helpers";

let connectionMgr: ConnectionManager | null = null;
beforeAll(async () => {
  const config = configFactory();
  connectionMgr = new ConnectionManager(config);
  console.log("=== connecting ===");
  const db = await connectionMgr.connect();
  setDb(db);

  console.log("=== migrate ===");
  await migrate(db, {
    // migrations folder is relative to the
    // current working(pnpm test) directory
    migrationsFolder: "./src/db/migrations",
  });
});

afterAll(async () => {
  console.log("=== disconnecting ===");
  await connectionMgr?.disconnect();
});
