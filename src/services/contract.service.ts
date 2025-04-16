import { Injectable, OnModuleInit } from '@nestjs/common';
import axios from "axios";
import { Contract, ethers, HDNodeWallet, InterfaceAbi, TransactionReceipt } from "ethers";
import { parseObject } from '../utils/parse_object';



@Injectable()
export class ContractService {
    private provider: ethers.JsonRpcProvider;
    private signer: ethers.Wallet;
    
    constructor() {}
    

    async onModuleInit() {
    
        // Set up the provider
        this.provider = new ethers.JsonRpcProvider(process.env.POLYGON_NODE_URL);
    
        // Initialize signer from private key
        this.signer = new ethers.Wallet(process.env.SYSTEM_WALLET_PRIVATE_KEY, this.provider);
    
        // Initialize contracts
        this.transferFundsContract = await this.fetchContract(process.env.TRANSFER_FUNDS_CONTRACT_ADDRESS);
    
        console.log('Contracts has been initialized');
    
    }


    async fetchABI(contractAddress: string): Promise<InterfaceAbi> {
        try {
    
            // get the abi from the network
            const res = await axios.get(process.env.POLYSCAN_ABI_URL, {
                params: {
                  address: contractAddress as string,
                  apikey: process.env.POLYSCAN_API_KEY,
                },
                family: 4,
                timeout: 60000,
            });
            
            // fetch data from the response
            const { data } = res;
    
            // check if there was an error
            if (data.status !== '1') {
                throw new Error(`Failed to fetch ABI: ${data.result}`);
            }
    
            // log success
            console.log("The ABI has been fetched");
    
            // return the abi
            return JSON.parse(data.result) as InterfaceAbi;
      
        } catch (e) {
            console.error("Error fetching ABI:", e.message);
            throw e;
        }
    }


    async fetchContract(contractAddress: string): Promise<Contract> {
        try {
    
            // Fetch ABI
            const abi = await this.fetchABI(contractAddress);
    
            // check if there was an error
            if (!abi || !Array.isArray(abi)) {
                throw new Error('Invalid ABI: ABI is not an array.');
            }
    
            // return the contract
            return new Contract(
              contractAddress,
              abi,
              this.signer,
            );
    
        } catch (e) {
            console.error('Error initializing contract:', e.message);
            throw e;
        }
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


