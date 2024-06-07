import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BridgesModule } from './bridges/bridges.module';

@Module({
  imports: [BridgesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
