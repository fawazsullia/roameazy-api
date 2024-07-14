import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema()
export class Place {

    @Prop({ type: String, required: true, unique: true })
    placeId: string;

    @Prop()
    name: string;

    @Prop()
    country: string;

    @Prop({ required: false })
    description?: string;

    @Prop({ type: String, default: "country" })
    type: string;

    @Prop({ type: mongoose.Types.Array, default: [] })
    images: string[];

    @Prop({ type: Boolean, default: false })
    isDeparture: boolean;

    @Prop({ type: Boolean, default: false })
    isDestination: boolean;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;

    @Prop({ default: true })
    isActive: boolean;
}

export const placeSchema = SchemaFactory.createForClass(Place);

placeSchema.index({ name: 'text' })
