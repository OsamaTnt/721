import { Injectable, OnModuleInit } from '@nestjs/common';
import axios from "axios";
import { Contract, ethers, HDNodeWallet, InterfaceAbi, TransactionReceipt } from "ethers";
import { parseObject } from '../utils/parse_object';
import { ContractService } from './contract.service';
import { NETWORK_TYPE, NetworkType } from 'src/core/app_types';



@Injectable()
export class TransferFundsService implements OnModuleInit{

    private transferFundsContract: Contract;
    private provider: ethers.JsonRpcProvider;
    private signer: ethers.Wallet;

    constructor(
        private readonly contractService: ContractService,
    ) {}


    async onModuleInit() {

        // Initialize the provider and signer
        this.provider = this.getProvider(NETWORK_TYPE.POLYGON); // Polygon network
        this.signer = this.getSigner(NETWORK_TYPE.POLYGON);

        // Initialize contracts
        this.transferFundsContract = await this.contractService.fetchContract(
            NETWORK_TYPE.POLYGON,
            process.env.TRANSFER_FUNDS_CONTRACT_ADDRESS,
            this.signer,
        );

        console.log('TransferFundsContract has been initialized');

    }


    // ============ Dynamic Provider and Signer ============
    private getProvider(network: NetworkType): ethers.JsonRpcProvider {
        const url = network === NETWORK_TYPE.POLYGON? 
        `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
        :`https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`;

        return new ethers.JsonRpcProvider(url);
    }


    private getSigner(network: NetworkType): ethers.Wallet {
        const provider = this.getProvider(network);
        return new ethers.Wallet(
        process.env.SYSTEM_WALLET_PRIVATE_KEY,
        provider,
        );
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
            console.error('Error fetching All Transactions:', error);
            if (error instanceof Error) {
                console.error('Error message:', error.message);
            }
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

