import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { AirportTransfer, Meals } from "src/enums";
import { Itinerary, ListingHotel, VariablePrice } from "src/types";

@Schema()
export class Listing {

    @Prop()
    title: string;

    // a listing will not be shown if not verified
    @Prop({ type: Boolean, default: false, required: true })
    isVerified: boolean;

    @Prop({ type: String, required: true})
    from: string;

    @Prop({ type: String, required: true})
    to: string; // this will be the country

    @Prop({ type: mongoose.Types.Array, required: true })
    includedPlaces: string[];

    @Prop({ type: Number, required: true })
    numberOfNights: number;

    // these are whatsa included in the package
    @Prop({ type: mongoose.Types.Array, required: true })
    mealsIncluded: Meals[];

    @Prop({ type: Boolean, default: false, required: true })
    travelInsurance: boolean;

    @Prop({ type: Number, required: false })
    visaFee?: number;

    @Prop({ type: mongoose.Types.Array, required: false })
    hotels?: ListingHotel[];

    @Prop({ type: String, required: false })
    airPortTransfers?: AirportTransfer;

    // included ends here

    @Prop({ type: mongoose.Types.Array, required: true })
    itinerary: Itinerary[];

    @Prop({ type: mongoose.Types.Array, required: false })
    tags?: string[];

    @Prop({ type: Date, required: true })
    startDate: Date;

    @Prop({ type: Date, required: true })
    endDate: Date;

    @Prop({ type: Date, default: Date.now })
    createdAt: Date;

    @Prop({ type: Date, default: Date.now })
    updatedAt: Date;

    @Prop({ type: Boolean, default: true })
    isActive: boolean;

    @Prop({ type: Boolean, default: false })
    isFeatured: boolean;

    @Prop({ type: Number, required: true })
    basePrice: number;

    @Prop({ type: mongoose.Types.Array, default: [] })
    variablePrices: VariablePrice[];

    @Prop({ type: Number, default: 0 })
    price: number; // this is the total price including variable prices
}

export const ListingSchema = SchemaFactory.createForClass(Listing);