import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema()
export class User {

    @Prop({required: true, type: String})
    name: string;

    @Prop({required: true, type: String})
    email: string;

    @Prop({required: false, type: String})
    password?: string;

    @Prop({ required: true, type: String })
    role: string;

    @Prop({ required: true, type: Date, default: Date.now })
    createdAt: Date;

    @Prop({ required: true, type: Date, default: Date.now })
    updatedAt: Date;

    @Prop({ type: mongoose.Types.ObjectId, required: true })
    companyId: mongoose.Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);

