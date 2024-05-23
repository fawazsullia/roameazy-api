import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ContentDocument = HydratedDocument<Content>;

// This will store stuff that is related to pages to be generated, for example, bali listings and the content related to it

@Schema()
export class Content {
    @Prop()
    key: string;
  
    @Prop({ type: mongoose.Types.Map })
    data: { [key: string]: any };

    @Prop()
    group: string;
  
    @Prop()
    createdAt: Date;
  
    @Prop()
    updatedAt: Date;
}

export const ContentSchema = SchemaFactory.createForClass(Content);