import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RoleDocument = Role & Document;

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
  USER = 'user',
}

@Schema({ collection: 'roles', timestamps: true })
export class Role {
  @Prop({ type: String, enum: UserRole, required: true, unique: true })
  name: UserRole;

  @Prop({ type: String, required: false })
  description?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Feature' }], default: [] })
  features: Types.ObjectId[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);

