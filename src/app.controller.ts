import { Controller, Get, Inject, Injectable } from "@nestjs/common";
import { DB, DBType } from "./db/db.provider";

@Injectable()
@Controller()
export class AppController {
  constructor(@Inject(DB) private db: DBType) {}

  @Get("/")
  health(): string {
    return "OK";
  }
}
