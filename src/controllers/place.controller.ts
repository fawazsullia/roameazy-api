import { Body, Controller, Get, Inject, Post } from "@nestjs/common";
import { CreatePlaceRequest, GetDepartingPlacesRequest, SuccessReponse } from "src/models";
import { PlaceService } from "src/services/place.service";

@Controller('place')
export class PlaceController {

    @Inject()
    private placeService: PlaceService;

    @Post()
    async create(
        @Body() body: CreatePlaceRequest
    ) {
         await this.placeService.create(body);
         return new SuccessReponse();
    }

    @Post('get-departing')
    async getDeparting(
        @Body() body: GetDepartingPlacesRequest
    ) {
        return this.placeService.getDeparting(body);
    }

    @Post('get-destination')
    async getDestination(
        @Body() body: GetDepartingPlacesRequest
    ) {
        return this.placeService.getDestinations(body);
    }
}