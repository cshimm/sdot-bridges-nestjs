import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Bridge {
  @Prop()
  name: string;
  @Prop()
  status: string;
  @Prop()
  lastOpened: Date;
  @Prop()
  lastClosed: Date;
}

export const BridgeSchema = SchemaFactory.createForClass(Bridge);