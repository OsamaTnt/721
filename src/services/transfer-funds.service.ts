import { Injectable, OnModuleInit } from '@nestjs/common';
import axios from "axios";
import { Contract, ethers, HDNodeWallet, InterfaceAbi, TransactionReceipt } from "ethers";
import { parseObject } from '../utils/parse_object';
import { ContractService } from './contract.service';
import { NETWORK_TYPE } from 'src/core/app_types';



@Injectable()
export class TransferFundsService implements OnModuleInit{
    
    private transferFundsContract: Contract;
    
    constructor(
        private readonly contractService: ContractService,
    ) {}
    

    async onModuleInit() {

        // Initialize contracts
        this.transferFundsContract = await this.contractService.fetchContract(
            NETWORK_TYPE.POLYGON,
            process.env.TRANSFER_FUNDS_CONTRACT_ADDRESS,
        );
    
        console.log('TransferFundsContract has been initialized');
    
    }



    //READ (GET - COST 0)
    async getAllTransactions(): Promise<any> {
        try {
            console.log(`Fetching All Transactions..`);

            // Call the contract method to get all transactions
            const data = await this.transferFundsContract.getAllTransactions();

            console.log('All Transactions fetched successfully:', data);

            // Transform the data if necessary and return
            return parseObject(data);

        } catch (error) {
            console.error('Error fetching All Transactions:', error.message);
            throw error;
        }
    }

    
    //READ (GET - COST 0)
    async getTransactionCount(): Promise<any> {
        try {

            console.log(`Fetching Transactions Count..`);
        
            // Call the contract method to get Transactions Count
            const data = await this.transferFundsContract.getTransactionCount();

            console.log('Transactions Count fetched successfully:', data);

            // Transform the data if necessary and return
            return parseObject(data);

        } catch (error) {
            console.error('Error fetching Transactions Count:', error.message);
            throw error;
        }
    }


    //WRITE (POST - COST GAS FEES)
    async addDataToBlockchain(
        receiverAddr: string,
        amount: number,
        message: string
    ): Promise<TransactionReceipt> {
        try {

            console.log('Sending transaction to blockchain...');
    
            // Call the smart contract method with parameters
            const tx = await this.transferFundsContract.addDataToBlockchain(
                receiverAddr,
                ethers.parseUnits(amount.toString(), "ether"), // convert to wei
                message
            );
    
            console.log('Transaction sent, waiting for confirmation...', tx.hash);
    
            // Wait for the transaction to be mined
            const receipt = await tx.wait();
        
            console.log('Transaction confirmed:', receipt.transactionHash);
        
            return receipt;

        } catch (error) {
            console.error('Error adding data to blockchain:', error.message);
            throw error;
        }
    }
  

}

