import { Module } from '@nestjs/common';
import { BridgesController } from './bridges.controller';
import { BridgesService } from './bridges.service';
import { MongooseModule } from "@nestjs/mongoose";
import { BridgeSchema } from "./schemas/bridge.schema";

@Module({
  imports : [
    MongooseModule.forFeature([{ name: 'Bridge', schema : BridgeSchema}])
  ],
  controllers: [BridgesController],
  providers: [BridgesService]
})
export class BridgesModule {}
