import { Module } from '@nestjs/common';
import { TransferFundsController } from 'src/controllers/transfer-funds.controller';
import { TransferFundsService } from 'src/services/transfer-funds.service';


@Module({
  imports: [],
  controllers: [TransferFundsController],
  providers: [TransferFundsService],
})
export class TransferFundsModule {}


