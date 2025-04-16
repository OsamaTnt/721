import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from "@nestjs/config";

import { TransferFundsModule } from './modules/transfer-funds.module';
import { ContractServiceService } from './contract-service/contract-service.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
  }),
    TransferFundsModule,
  ],
  controllers: [AppController],
  providers: [AppService, ContractServiceService],
})
export class AppModule {}

