import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ContentDocument = HydratedDocument<Content>;

@Schema()
export class Content {
    @Prop()
    title: string;
    
    @Prop()
    description: string;
    
    @Prop()
    body: string;
    
    @Prop()
}

export const ContentSchema = SchemaFactory.createForClass(Content);