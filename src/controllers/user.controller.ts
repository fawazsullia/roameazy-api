import { Body, Controller, Inject, Post } from "@nestjs/common";
import { CreateUserRequest } from "src/models";
import { UserService } from "src/services";

@Controller('user')
export class UserController {
  // ...

  @Inject()
  private userService: UserService;

  // this api is to create a new admin user
  @Post('create/admin')
  async create(
    @Body() body: CreateUserRequest
  ) {
    return this.userService.create(body);
  }
}