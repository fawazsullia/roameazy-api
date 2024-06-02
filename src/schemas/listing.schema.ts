import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Listing {

    @Prop()
    title: string;

    // a listing will not be shown if not verified
    @Prop({ type: Boolean, default: false, required: true })
    isVerified: boolean;


}

export const ListingSchema = SchemaFactory.createForClass(Listing);