import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class SuperAdminUser {
    @Prop({ type: String, required: true, unique: true })
    username: string;

    @Prop({ type: String, required: true })
    password: string;

    @Prop({ type: String, required: true, unique: true })
    email: string;

    @Prop({ type: String, required: true })
    role: string;

    @Prop({ type: Boolean, default: true })
    isActive: boolean;

    @Prop({ type: Date, default: Date.now })
    createdAt: Date;

    @Prop({ type: Date, default: Date.now })
    updatedAt: Date;
}

export const SuperAdminUserSchema = SchemaFactory.createForClass(SuperAdminUser);