import { Body, Controller, Get, Inject, Post, Query } from "@nestjs/common";
import { CreateListingRequest, GetListingRequest, SuccessReponse } from "src/models";
import { ListingService } from "src/services";

@Controller('listing')
export class ListingController {
    
    @Inject()
    private listingService: ListingService;

    @Post()
    async create(
        @Body() body: CreateListingRequest
    ) {
        await this.listingService.create(body);
        return new SuccessReponse();
    }

    @Post()
    async getListings(

        @Body() body: GetListingRequest
    ) {
        return this.listingService.get(body);
    }
}