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
        return this.contentService.create(body);
    }

    @Post('update')
    async update(
        @Body() body: UpdateContentRequest
    ) {
        return this.contentService.update(body);
    }

    @Post('get')
    async get(
        @Body() body: GetContentRequest
    ) {
        return this.contentService.get(body);
    }
}