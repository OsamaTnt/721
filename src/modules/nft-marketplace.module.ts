import { Module } from '@nestjs/common';
import { NftMarketplaceController } from '../controllers/nft-marketplace.controller';
import { NftMarketplaceService } from 'src/services/nft-marketplace.service';
import { ContractService } from 'src/services/contract.service';


@Module({
  controllers: [NftMarketplaceController],
  providers: [NftMarketplaceService, ContractService]
})
export class NftMarketplaceModule {}

