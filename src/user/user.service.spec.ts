import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { DBModule } from "src/db/db.module";
import { truncateTable, seedTable } from "../../test/helpers";
import { users } from "src/db/schema";
import { compare } from "src/common/tools";

function createUsers() {
  return [
    {
      nickname: "tom",
      email: "tom@example.com",
      password: "123456",
    },
    {
      nickname: "jerry",
      email: "jerry@example.com",
      password: "234567",
    },
    {
      nickname: "butch",
      email: "butch@example.com",
      password: "345678",
    },
    {
      nickname: "spike",
      email: "spike@example.com",
      password: "456789",
    },
  ];
}

export async function insertToUsers() {
  const rows = createUsers();
  return await seedTable(users, rows);
}

describe("UserService", () => {
  let service: UserService;

  beforeEach(async () => {
    await truncateTable(users);
    const module: TestingModule = await Test.createTestingModule({
      imports: [DBModule],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return all users without passwords", async () => {
    await insertToUsers();
    const users = await service.list({ limit: 10, page: 1 });
    expect(users).toBeDefined();
    expect(Array.isArray(users)).toBe(true);

    // password field must be not exists
    const firstUser = users[0];
    expect(firstUser).not.toHaveProperty("password"); // Ensure password is not included
  });

  it("should return users with pagination params", async () => {
    await insertToUsers();
    const items = await service.list({
      page: 1,
      limit: 2,
    });
    expect(items.length).toBe(2);

    // without password field
    const [user1, user2] = items;
    expect(user1).not.toHaveProperty("password");
    expect(user1.nickname).toBe("tom");
    expect(user2.nickname).toBe("jerry");

    const items2 = await service.list({
      page: 3,
      limit: 1,
    });
    expect(items2.length).toBe(1);

    // without password field
    const [user3] = items2;
    expect(user3).not.toHaveProperty("password");
    expect(user3.nickname).toBe("butch");
  });

  it("should create user", async () => {
    const email = "test123456@example.com";
    const [createdUser] = await service.create({
      email,
      password: "123456",
    });
    expect(createdUser.email).toBe(email);
  });

  it("should be encrypt password when create user", async () => {
    // insert first
    const originalPassword = "123456";
    const [insertedUser] = await service.create({
      email: "test123456@example.com",
      password: originalPassword,
    });
    expect(insertedUser.password).not.toBe(originalPassword);

    // check password encryption
    const isMatched = await compare(originalPassword, insertedUser.password);
    expect(isMatched).toBe(true);
  });

  it("should update user", async () => {
    // insert first
    const [insertedUser] = await service.create({
      email: "test123456@example.com",
      password: "123456",
    });

    // update email field
    const newEmail = "new_email@example.com";
    const updatedRows = await service.update(insertedUser.id, {
      email: newEmail,
    });
    const updatedUser = updatedRows[0];
    expect(updatedUser.email).toBe(newEmail);
  });

  it("should encrypt password when update user", async () => {
    const oldPassword = "old-password";
    const newPassword = "new-password";

    // insert
    const [insertedUser] = await service.create({
      email: "12345@example.com",
      password: oldPassword,
    });

    // update password field
    const [updatedUser] = await service.update(insertedUser.id, {
      password: newPassword,
    });

    const isMatched = await compare(newPassword, updatedUser.password);
    expect(isMatched).toBe(true);
  });

  it("should delete user", async () => {
    // insert first
    const [insertedUser] = await service.create({
      email: "test123456@example.com",
      password: "123456",
    });

    // then delete it
    const [deletedUser] = await service.delete(insertedUser.id);
    expect(deletedUser.id).toBe(insertedUser.id);

    // select it
    const items = await service.list({ limit: 10, page: 1 });
    expect(items.length).toBe(0);
  });
});
