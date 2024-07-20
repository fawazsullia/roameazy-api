import { IsBoolean, IsIn, IsNumber, IsOptional, IsString } from "class-validator";

export class GetListingRequest {

    @IsNumber()
    offset: number;

    @IsNumber()
    limit: number;

    @IsOptional()
    @IsString()
    from?: string;

    @IsOptional()
    @IsString()
    to?: string;

    @IsOptional()
    @IsString()
    @IsIn(['active', 'inactive', 'all'])
    listingType?: 'active' | 'inactive' | 'all'; 

    @IsString()
    startDate: string;

    @IsString()
    endDate: string;

    @IsBoolean()
    @IsOptional()
    isFeatured?: boolean;
}