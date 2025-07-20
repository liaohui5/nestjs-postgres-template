import { users } from "src/db/schema";
import { DBType } from "../src/db/db.provider";
// import { reset } from "drizzle-seed";
import { PgTableWithColumns, TableConfig } from "drizzle-orm/pg-core";

// databse connection
let __db: DBType | null = null;
export function setDb(db: DBType) {
  __db = db;
}
export function getDb() {
  if (__db) {
    return __db;
  }
  throw new Error("[test helper]db not initialized");
}

// delete all rows of table and reset auto increment index
export async function truncateTable(tableSchema: PgTableWithColumns<any>) {
  const db = getDb();
  // TODO: drizzle-seed reset is not working
  // await reset(db, tableSchema);

  // can not reset auto increment index when delete datas by manualy
  await db.delete(tableSchema).execute();
}

// fill some data to table
export async function seedTable<T extends object>(tableSchema: PgTableWithColumns<any>, items: T[]) {
  if (!(Array.isArray(items) && items.length > 0)) {
    throw new Error("[test helper]seed items is empty");
  }
  const db = getDb();
  return await db.insert(tableSchema).values(items).returning();
}
