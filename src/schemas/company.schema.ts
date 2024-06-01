import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type CompanyDocument = HydratedDocument<Company>;

@Schema()
export class Company {
    @Prop()
    name: string;

    @Prop({ required: true, type: Boolean, default: false })
    isVerified: boolean;

    @Prop({ required: true, type: String, default: 'free' })
    plan: string;

    @Prop({ required: true })
    createdAt: Date;

    @Prop({ required: true })
    updatedAt: Date;
}

export const CompanySchema = SchemaFactory.createForClass(Company);