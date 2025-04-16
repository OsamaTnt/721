import { Module } from '@nestjs/common';
import { TransferFundsController } from 'src/controllers/transfer-funds.controller';
import { ContractService } from 'src/services/contract.service';
import { TransferFundsService } from 'src/services/transfer-funds.service';


@Module({
  imports: [],
  controllers: [TransferFundsController],
  providers: [TransferFundsService, ContractService],
})
export class TransferFundsModule {}


