import { Controller, Get, Post, HttpException, HttpStatus, Query, Body, BadRequestException } from '@nestjs/common';
import { STATUS_CODES } from "http";

import { TransferFundsService } from 'src/services/transfer-funds.service';
import { AppResponse } from 'src/core/app_response';
import * as AppConsts from 'src/core/app_consts';
import * as AppErrs from 'src/core/app_errors';
import { ContractService } from 'src/services/contract.service';
import { NETWORK_TYPE, NetworkType } from 'src/core/app_types';




@Controller('transfer_funds')
export class TransferFundsController {

    constructor(
      private readonly contractService: ContractService,
      private readonly transferFundsService: TransferFundsService,
    ){}


    @Get('abi')
    async fetchContractABI(
      @Query('network') network: string,
      @Query('address') address: string,
    ): Promise<AppResponse> {
      try {

        // Convert network to lowercase for case-insensitive comparison
        const selectedNetwork = network?.toLowerCase();

        // Validate network type
        if (!selectedNetwork || !['polygon', 'ethereum'].includes(selectedNetwork)) {
            throw new BadRequestException(AppErrs.ERR_NETWORK_NOT_SUPPORTED);
        }

        // fetch abi
        const abi = await this.contractService.fetchABI(
          selectedNetwork as NetworkType, 
          address,
        );

        // return response
        return new AppResponse({
            status: STATUS_CODES[HttpStatus.OK],
            code: HttpStatus.OK,
            message: AppConsts.FETCHED,
            data: abi,
        });

      } catch (error: any) {
          throw new HttpException(
            {
              status: error.name || AppErrs.ERR_INTERNAL_ERROR,
              code: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
              message: error.message || STATUS_CODES[HttpStatus.INTERNAL_SERVER_ERROR],
            },
            error.status || HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }


    @Get('transactions')
    async getAllTransactions(): Promise<AppResponse> {
      try {

        const data = await this.transferFundsService.getAllTransactions();
        console.log(data)

        // return response
        return new AppResponse({
            status: STATUS_CODES[HttpStatus.OK],
            code: HttpStatus.OK,
            message: AppConsts.FETCHED,
            data: data,
        });

      } catch (error: any) {
          throw new HttpException(
            {
              status: error.name || AppErrs.ERR_INTERNAL_ERROR,
              code: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
              message: error.message || STATUS_CODES[HttpStatus.INTERNAL_SERVER_ERROR],
            },
            error.status || HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }


    @Get('transactions_count')
    async getTransactionCount(): Promise<AppResponse> {
      try {

        const data = await this.transferFundsService.getTransactionCount();
        console.log(data)

        // return response
        return new AppResponse({
            status: STATUS_CODES[HttpStatus.OK],
            code: HttpStatus.OK,
            message: AppConsts.FETCHED,
            data: data,
        });

      } catch (error: any) {
          throw new HttpException(
            {
              status: error.name || AppErrs.ERR_INTERNAL_ERROR,
              code: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
              message: error.message || STATUS_CODES[HttpStatus.INTERNAL_SERVER_ERROR],
            },
            error.status || HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }


    @Post('add_to_blockchain')
    async addDataToBlockchain(
      @Body('receiverAddr') receiverAddr: string,
      @Body('amount') amount: number,
      @Body('message') message: string
    ): Promise<AppResponse> {
      try {
        const data = await this.transferFundsService.addDataToBlockchain(
          receiverAddr, 
          amount, 
          message,
        );
        console.log(data)

        // return response
        return new AppResponse({
          status: STATUS_CODES[HttpStatus.OK],
          code: HttpStatus.OK,
          message: AppConsts.FETCHED,
          data: data,
        });

      } catch (error: any) {
          throw new HttpException(
            {
              status: error.name || AppErrs.ERR_INTERNAL_ERROR,
              code: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
              message: error.message || STATUS_CODES[HttpStatus.INTERNAL_SERVER_ERROR],
            },
            error.status || HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }


}


