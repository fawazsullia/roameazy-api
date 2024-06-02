import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, mongo } from "mongoose";

export type CompanyDocument = HydratedDocument<CompanyDetail>;

@Schema()
export class CompanyDetail {

    @Prop({ required: true, type: String})
    description: string;

    @Prop({ required: false, type: String})
    logo: string;

    @Prop({ required: true, type: String})
    address: string;

    @Prop({ required: true, type: String})
    email: string;

    @Prop({ default: '', type: String })
    alternateEmail?: string;

    @Prop({ required: true ,type: String})
    phone: string;

    @Prop({ default: '', type: String})
    alternatePhone?: string;

    @Prop({ required: true, type: mongoose.Types.ObjectId })
    companyId: mongoose.Types.ObjectId;

    @Prop({ required: true })
    createdAt: Date;

    @Prop({ required: true  })
    tradeLicense: string;

    @Prop({ required: true })
    updatedAt: Date;
}

export const CompanyDetailSchema = SchemaFactory.createForClass(CompanyDetail);