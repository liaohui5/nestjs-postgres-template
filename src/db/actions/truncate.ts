// import { reset } from "drizzle-seed";
import { users } from "../schema";
import { connection } from "./connection";

async function run() {
  // TOOD: drizzle-seed reset is not working
  // await reset(connection, users);

  // can not reset auto increment index when delete datas by manualy
  await connection.delete(users).execute();
}

run()
  .then(() => {
    console.log("=== [database truncate completed] ===");
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
