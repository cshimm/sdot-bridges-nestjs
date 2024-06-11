import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

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
  role: Role;
  @Prop()
  favorites: string[];
}

export const UserAuthSchema = SchemaFactory.createForClass(User);