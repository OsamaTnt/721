import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from "@nestjs/config";

import { TransferFundsModule } from './modules/transfer-funds.module';
import { NftMarketplaceModule } from './modules/nft-marketplace.module';
import { ContractService } from './services/contract.service';
import { IpfsService } from './services/ipfs.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
  }),
    TransferFundsModule,
    NftMarketplaceModule,
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    ContractService,
    IpfsService,
  ],
})
export class AppModule {}

