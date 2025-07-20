import { sql } from "drizzle-orm";
import { connection } from "./connection";

async function run() {
  const query1 = sql`
    select schemaname,tablename 
      from pg_catalog.pg_tables 
      where schemaname = 'public'
  `;
  const query2 = sql`
    select schemaname,tablename 
      from pg_catalog.pg_tables 
      where schemaname = 'drizzle'
  `;

  const { rows: publicTabs } = await connection.execute(query1);
  const { rows: drizzleTabs } = await connection.execute(query2);

  const dropTableTasks = [...publicTabs, ...drizzleTabs].map((item: { schemaname: string; tablename: string }) => {
    const tableNameWithPgSchma = `${item.schemaname}.${item.tablename}`;
    const query = sql`drop table ${sql.raw(tableNameWithPgSchma)}`;
    return connection.execute(query);
  });

  await Promise.all(dropTableTasks);
}

run()
  .then(() => {
    console.log("=== [database reset completed] ===");
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
