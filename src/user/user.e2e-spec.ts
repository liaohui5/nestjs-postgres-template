import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app.module";
import { applyGlobalMiddlewares } from "src/common";
import { App } from "supertest/types";
import { insertToUsers } from "./user.service.spec";
import { users } from "src/db/schema";
import { truncateTable } from "../../test/helpers";
import * as request from "supertest";

describe("UserController (e2e)", () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // global middlewares
    applyGlobalMiddlewares(app);

    // fill some default data to databse
    await truncateTable(users);

    // init module
    await app.init();
  });

  it("GET /user", async () => {
    // fill some data to database first
    await insertToUsers();
    await request(app.getHttpServer())
      .get("/user?page=1&limit=10")
      .set("Accept", "application/json")
      .expect(200)
      .expect(({ body }) => {
        expect(body.code).toBe(0);
        expect(body.msg).toBe("success");
        expect(Array.isArray(body.data)).toBeTruthy();
        const [firstItem] = body.data;

        const fields = [
          // users table fields, must be without password field
          "id",
          "nickname",
          "email",
          "created_at",
          "updated_at",
        ];
        fields.forEach((field) => {
          expect(firstItem).toHaveProperty(field);
        });
      });
  });

  it("POST /user", async () => {
    const requestBody = {
      name: "test",
      email: "test@test.com",
      password: "testtest",
    };
    await request(app.getHttpServer())
      .post("/user")
      .send(requestBody)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .expect(201)
      .expect(({ body }) => {
        expect(body.code).toBe(0);
      });
  });

  it("Delete /user", async () => {
    const [firstUser] = await insertToUsers();
    const id = firstUser.id;

    await request(app.getHttpServer())
      .delete(`/user/${id}`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .expect(200)
      .expect(({ body }) => {
        expect(body.code).toBe(0);
      });
  });

  it("Patch /user", async () => {
    const [firstUser] = await insertToUsers();
    const id = firstUser.id;

    await request(app.getHttpServer())
      .patch(`/user/${id}`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send({
        email: "test@test.com",
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.code).toBe(0);
      });
  });
});
