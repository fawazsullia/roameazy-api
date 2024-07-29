import { IsEnum, IsString } from "class-validator";
import mongoose from "mongoose";
import { EnquirySource } from "src/enums";

export class SubmitEnquiryRequest {

    @IsString()
    listingId: mongoose.Types.ObjectId;

    @IsString()
    companyId: mongoose.Types.ObjectId;

    @IsEnum(EnquirySource)
    source: EnquirySource;

    @IsString()
    phoneNumber: string;
}