import { Body, Controller, Delete, Get, Injectable, Param, Patch, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto, UpdateUserDto } from "./user.dto";
import { PaginationQuery } from "src/common/pagination.decorator";
import { PaginationDto } from "src/common/pagination.dto";

@Injectable()
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/")
  async list(@PaginationQuery() pagination: PaginationDto) {
    return this.userService.list(pagination);
  }

  @Post("/")
  async create(@Body() user: CreateUserDto) {
    return await this.userService.create(user);
  }

  @Delete("/:id")
  async delete(@Param("id") id: string) {
    return await this.userService.delete(+id);
  }

  @Patch("/:id")
  async update(@Param("id") id: string, @Body() user: UpdateUserDto) {
    return await this.userService.update(+id, user);
  }
}
