import { Injectable } from '@nestjs/common';
import axios from "axios";
import { Contract, ethers, HDNodeWallet, InterfaceAbi } from "ethers";


@Injectable()
export class ContractService {
    private provider: ethers.JsonRpcProvider;
    private signer: ethers.Wallet;
    
    constructor() {
        // Set up the provider
        this.provider = new ethers.JsonRpcProvider(process.env.POLYGON_NODE_URL);
    
        // Initialize signer from private key
        this.signer = new ethers.Wallet(process.env.SYSTEM_WALLET_PRIVATE_KEY, this.provider);
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



}

