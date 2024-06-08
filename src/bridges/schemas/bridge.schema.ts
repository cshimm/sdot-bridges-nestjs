import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Bridge {
  @Prop( { required: true })
  name: string;
  @Prop()
  status: string;
  @Prop()
  lastOpen: Date;
  @Prop()
  lastClosed: Date;
}

export const BridgeSchema = SchemaFactory.createForClass(Bridge);