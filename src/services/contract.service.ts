import { Injectable } from '@nestjs/common';
import axios from "axios";
import { Contract, ethers, HDNodeWallet, InterfaceAbi } from "ethers";
import { NETWORK_TYPE, NetworkType } from 'src/core/app_types';


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
    
    
    async fetchABI(network: NetworkType, contractAddress: string,): Promise<InterfaceAbi> {
        try {
            
            let apiUrl: string;
            let apiKey: string;

            if (network === NETWORK_TYPE.POLYGON) {
                apiUrl = 'https://api.polygonscan.com/api';
                apiKey = process.env.POLYSCAN_API_KEY;
            } else if (network === NETWORK_TYPE.ETHEREUM) {
                apiUrl = 'https://api.etherscan.io/api';
                apiKey = process.env.ETHERSCAN_API_KEY;
            }

            const res = await axios.get(apiUrl, {
                params: {
                    module: 'contract',
                    action: 'getabi',
                    address: contractAddress,
                    apikey: apiKey,
                },
                timeout: 60000,
          });

          const { data } = res;
      
          if (data.status !== '1') {
            throw new Error(`Failed to fetch ABI: ${data.result}`);
          }
      
          console.log('ABI fetched successfully');
          return JSON.parse(data.result) as InterfaceAbi;
        } catch (e) {
          console.error('Error fetching ABI:', e.message);
          throw e;
        }
    }
    


    async fetchContract(network: NetworkType ,contractAddress: string): Promise<Contract> {
        try {
    
            // Fetch ABI
            const abi = await this.fetchABI(network, contractAddress);
    
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

