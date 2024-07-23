import { Body, Controller, Inject, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { OnboardUserRequest } from "src/models";
import { CreateSuperAdminRequest } from "src/models/user/create-super-admin.request.model";
import { UserService } from "src/services";

@Controller('user')
export class UserController {
  // ...

  @Inject()
  private userService: UserService;

  // this api is to onboard a user and company
  @Post('onboard')
  @UseInterceptors(FileInterceptor('license'))
  async create(
    @Body() body: OnboardUserRequest,
    @UploadedFile() license: Express.Multer.File
  ) {
    return this.userService.create(body, license);
  }

  @Post('super-admin')
  async createSuperAdmin(
    @Body() body: CreateSuperAdminRequest
  ) {
    return this.userService.createSuperAdmin(body);
  }
}