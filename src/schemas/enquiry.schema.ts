import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { EnquirySource } from "src/enums";

@Schema()
export class Enquiry {

    @Prop({ type: mongoose.Types.ObjectId, required: true })
    listingId: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Types.ObjectId, required: true })
    companyId: mongoose.Types.ObjectId;

    @Prop({ type: Date, required: true })
    createdAt: Date;

    @Prop({ required: true, type: String })
    source: EnquirySource

    @Prop({ required: true, type: mongoose.Types.ObjectId })
    customerId: mongoose.Types.ObjectId;

}

export const EnquirySchema = SchemaFactory.createForClass(Enquiry);