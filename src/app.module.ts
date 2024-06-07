import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BridgesModule } from './bridges/bridges.module';

@Module({
  imports: [
    BridgesModule,
    MongooseModule.forRoot(process.env.MONGODB_URI),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
