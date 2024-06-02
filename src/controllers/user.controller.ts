import { Body, Controller, Inject, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { OnboardUserRequest } from "src/models";
import { UserService } from "src/services";

@Controller('user')
export class UserController {
  // ...

  @Inject()
  private userService: UserService;

  // this api is to create a new admin user
  @Post('onboard')
  @UseInterceptors(FileInterceptor('license'))
  async create(
    @Body() body: OnboardUserRequest,
    @UploadedFile() license: Express.Multer.File
  ) {
    return this.userService.create(body, license);
  }
  
}