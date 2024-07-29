import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Customer {

    @Prop({ required: false, type: String })
    phoneNumber: string;

    @Prop({ required: true, type: Date, default: Date.now })
    createdAt: Date;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);