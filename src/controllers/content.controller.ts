import { Body, Controller, Inject, Post } from "@nestjs/common";
import { CreateContentRequest, GetContentRequest, UpdateContentRequest } from "src/models";
import { ContentService } from "src/services";

@Controller('content')
export class ContentController {

    @Inject()
    private contentService: ContentService;
  
    @Post()
    async create(
        @Body() body: CreateContentRequest
    ) {
        await this.contentService.create(body);
    }

    @Post('update')
    async update(
        @Body() body: UpdateContentRequest
    ) {
        await this.contentService.update(body);
    }

    @Post('get')
    async get(
        @Body() body: GetContentRequest
    ) {
        return await this.contentService.get(body);
    }
}