import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Listing {

    @Prop()
    title: string;


}

export const ListingSchema = SchemaFactory.createForClass(Listing);