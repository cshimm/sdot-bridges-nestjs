import { Module } from '@nestjs/common';
import { BridgesController } from './bridges.controller';
import { BridgesService } from './bridges.service';

@Module({
  controllers: [BridgesController],
  providers: [BridgesService]
})
export class BridgesModule {}
