import { Controller, Get, Post, HttpException, HttpStatus, Query, Body } from '@nestjs/common';
import { STATUS_CODES } from "http";

import { NftMarketplaceService } from 'src/services/nft-marketplace.service';
import { AppResponse } from 'src/core/app_response';
import * as AppConsts from 'src/core/app_consts';
import * as AppErrs from 'src/core/app_errors';
import { ContractService } from 'src/services/contract.service';


@Controller('nft-marketplace')
export class NftMarketplaceController {

    constructor(
      private readonly contractService: ContractService,
      private readonly nftMarketplaceService: NftMarketplaceService,
    ){}


    @Get('abi')
    async fetchContractABI(@Query('address') address: string): Promise<AppResponse> {
        try {

        // fetch abi
        const abi = await this.contractService.fetchABI(address);
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
    

}

