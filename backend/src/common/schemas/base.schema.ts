import { Prop, Schema } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export abstract class BaseSchema {
  _id?: string;

  @Prop({ type: Date, default: Date.now })
  createdAt?: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt?: Date;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;
}

