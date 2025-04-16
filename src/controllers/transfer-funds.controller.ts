import { Controller, Get, Post, HttpException, HttpStatus, Query, Body } from '@nestjs/common';
import { STATUS_CODES } from "http";

import { TransferFundsService } from 'src/services/transfer-funds.service';
import { AppResponse } from 'src/core/app_response';
import * as AppConsts from 'src/core/app_consts';
import * as AppErrs from 'src/core/app_errors';


@Controller('transfer_funds')
export class TransferFundsController {

    constructor(
        private readonly transferFundsService: TransferFundsService,
    ){}


    @Get('abi')
    async fetchContractABI(@Query('address') address: string): Promise<AppResponse> {
      try {

        // fetch abi
        const abi = await this.transferFundsService.fetchABI(address);
        console.log('abi::::::')
        console.log(abi)

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
        const data = await this.transferFundsService.addDataToBlockchain(receiverAddr, amount, message);
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


