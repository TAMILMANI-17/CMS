import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { LocationSchema } from '../../common/schemas/location.schema';
import { UserRole } from '../../roles/schemas/role.schema';

export type UserDocument = User & Document;

@Schema({ collection: 'users', timestamps: true })
export class User {
  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String, required: true, unique: true })
  username: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  @Exclude()
  password: string;

  @Prop({ type: Date, required: false })
  dateOfBirth?: Date;

  @Prop({ type: String, required: false })
  phoneNumber?: string;

  @Prop({ type: LocationSchema, required: false })
  location?: LocationSchema;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Prop({ type: String, required: false })
  refreshToken?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Role' }], default: [] })
  roles: Types.ObjectId[];

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

