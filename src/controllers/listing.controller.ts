import { Body, Controller, Get, Inject, Param, Post, Query } from "@nestjs/common";
import { CreateListingRequest, GetListingRequest, SubmitEnquiryRequest, SuccessReponse } from "src/models";
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

    @Post('get-listings')
    async getListings(

        @Body() body: GetListingRequest
    ) {
        return this.listingService.get(body);
    }

    @Get(':listingId')
    async getListingById(
        @Param('listingId') listingId: string
    ) {
        return this.listingService.getListingById(listingId);
    }

    @Post('submit-enquiry')
    async createEnquiry(
        @Body() body: SubmitEnquiryRequest
    ) {
        await this.listingService.submitEnquiry(body);
        return new SuccessReponse();
    }
}