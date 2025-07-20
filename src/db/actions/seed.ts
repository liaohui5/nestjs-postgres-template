import { seed } from "drizzle-seed";
import { users } from "../schema";
import { connection } from "./connection";

// seed some default users data to database
// can be use: drizzle-seed/mockjs/faker.js
// drizzle: https://orm.drizzle.team/docs/seed-overview
// mockjs: http://mockjs.com/
// faker.js: https://github.com/marak/Faker.js/
async function fillUesrsTable() {
  //// manualy fill data
  // const items = [
  //   {
  //     nickname: "tom",
  //     email: "tom@qq.com",
  //     password: "123456",
  //   },
  //   {
  //     nickname: "jerry",
  //     email: "jerry@qq.com",
  //     password: "654321",
  //   },
  // ];
  // return await connection.insert(usersTable).values(items).execute();

  //// auto fill data
  await seed(connection, { seed: users }, { count: 30 });
}

const seeders = [fillUesrsTable];
async function run() {
  const tasks = seeders.map((item) => item());
  await Promise.all(tasks);
}

run()
  .then(() => {
    console.log("=== [database seed completed] ===");
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
