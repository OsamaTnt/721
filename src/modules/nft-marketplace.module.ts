import { Module } from '@nestjs/common';
import { NftMarketplaceController } from '../controllers/nft-marketplace.controller';
import { NftMarketplaceService } from 'src/services/nft-marketplace.service';
import { ContractService } from 'src/services/contract.service';
import { IpfsService } from 'src/services/ipfs.service';


@Module({
  controllers: [NftMarketplaceController],
  providers: [
    NftMarketplaceService, 
    ContractService,
    IpfsService,
  ]
})
export class NftMarketplaceModule {}

