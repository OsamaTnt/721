import { Module } from '@nestjs/common';
import { NftMarketplaceController } from '../controllers/nft-marketplace.controller';
import { NftMarketplaceService } from 'src/services/nft-marketplace.service';


@Module({
  controllers: [NftMarketplaceController],
  providers: [NftMarketplaceService]
})
export class NftMarketplaceModule {}

