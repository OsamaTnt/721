import { Injectable, OnModuleInit } from '@nestjs/common';
import axios from "axios";
import { Contract, ethers, HDNodeWallet, InterfaceAbi, TransactionReceipt } from "ethers";
import { parseObject } from '../utils/parse_object';
import { ContractService } from './contract.service';
import { IpfsService } from './ipfs.service';



@Injectable()
export class NftMarketplaceService implements OnModuleInit{


    private nftMarketplaceContract: Contract;


    
    constructor(
        private readonly contractService: ContractService,
        private readonly ipfsService: IpfsService,
    ) {}



    async onModuleInit() {

    //     // Initialize contracts
    //     this.nftMarketplaceContract = await this.contractService.fetchContract(
    //         process.env.NFT_MARKETPLACE_CONTRACT_ADDRESS,
    //     );
    
    //     console.log('NftMarketplaceContract has been initialized');
    }


}


