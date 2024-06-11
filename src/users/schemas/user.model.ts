import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export interface UserDocument extends Document {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  favorites: string[];
  role: Role;
}

export enum Role {
  admin = "admin",
  user = "user"
}

@Schema({
  timestamps: true
})
export class User extends Document {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ unique: [true, "Duplicate email entered"] })
  email: string;

  @Prop()
  password: string;

  @Prop()
  favorites: string[];

  @Prop()
  readonly role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);