import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FeatureDocument = Feature & Document;

@Schema({ collection: 'features', timestamps: true })
export class Feature {
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: String, required: false })
  description?: string;
}

export const FeatureSchema = SchemaFactory.createForClass(Feature);

