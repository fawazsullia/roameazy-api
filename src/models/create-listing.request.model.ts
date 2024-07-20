import { IsBoolean, IsEnum, IsNumber, IsObject, IsOptional, IsString } from "class-validator";
import { AirportTransfer, Meals } from "src/enums";
import { Itinerary, ListingHotel } from "src/types";

export class CreateListingRequest {
    @IsString()
    title: string;

    @IsString()
    from: string;

    @IsString()
    to: string;

    @IsString({ each: true })
    includedPlaces: string[];

    @IsNumber()
    numberOfNights: number;

    @IsString({ each: true })
    mealsIncluded: Meals[];

    @IsBoolean()
    travelInsurance: boolean;

    @IsNumber()
    @IsOptional()
    visaFee?: number;

    @IsOptional()
    @IsObject({ each: true })
    hotels?: ListingHotel[];

    @IsEnum(AirportTransfer)
    @IsOptional()
    airPortTransfers?: AirportTransfer;

    @IsObject({ each: true })
    itinerary: Itinerary[];

    @IsString({ each: true })
    tags?: string[];

    @IsString()
    startDate: string;

    @IsString()
    endDate: string;
}