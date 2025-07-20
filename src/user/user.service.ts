import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { DB, DBType } from "src/db/db.provider";
import { CreateUserDto, UpdateUserDto } from "./user.dto";
import { users } from "src/db/schema";
import { PaginationDto } from "src/common/pagination.dto";
import { eq } from "drizzle-orm";
import { encrypt } from "src/common/tools";

@Injectable()
export class UserService {
  constructor(@Inject(DB) private db: DBType) {}

  async list({ limit, page }: PaginationDto) {
    const offset = (page - 1) * limit;
    return await this.db.query.users.findMany({
      columns: {
        password: false, // exclude password field
      },
      offset,
      limit,
    });
  }

  async create(user: CreateUserDto) {
    user.password = await encrypt(user.password);
    return await this.db.insert(users).values(user).returning();
  }

  async delete(id: number) {
    this.ifIdInvalidThrow(id);
    return await this.db.delete(users).where(eq(users.id, id)).returning();
  }

  async update(id: number, user: UpdateUserDto) {
    this.ifIdInvalidThrow(id);
    if (user.password) {
      user.password = await encrypt(user.password);
    }
    return await this.db.update(users).set(user).where(eq(users.id, id)).returning();
  }

  private ifIdInvalidThrow(id: number) {
    if (Number.isNaN(id)) {
      throw new BadRequestException("Invalid id");
    }
  }
}
