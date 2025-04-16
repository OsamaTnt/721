import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Contract, ethers, InterfaceAbi } from 'ethers';
import { NETWORK_TYPE, NetworkType } from 'src/core/app_types';
import { create as createIpfsClient, IPFSHTTPClient } from 'ipfs-http-client';


@Injectable()
export class ContractService {

  private ipfsClient: IPFSHTTPClient;


  constructor() {

    // --- IPFS via Infura Setup ---
    const projectId = process.env.INFORA_PROJECT_ID;
    const projectSecret = process.env.INFORA_SECRECT_KEY;
    const auth =
      'Basic ' +
      Buffer.from(`${projectId}:${projectSecret}`).toString('base64');

    this.ipfsClient = createIpfsClient({
      host: 'infura-ipfs.io',
      port: 5001,
      protocol: 'https',
      headers: {
        authorization: auth,
      },
    });
  }


  // ============ Dynamic Provider and Signer ============
  private getProvider(network: NetworkType): ethers.JsonRpcProvider {
    const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

    const url =
      network === NETWORK_TYPE.POLYGON
        ? `https://polygon-mainnet.infura.io/v3/${projectId}`
        : `https://mainnet.infura.io/v3/${projectId}`;

    return new ethers.JsonRpcProvider(url);
  }


  private getSigner(network: NetworkType): ethers.Wallet {
    const provider = this.getProvider(network);
    return new ethers.Wallet(
      process.env.SYSTEM_WALLET_PRIVATE_KEY,
      provider,
    );
  }


  // ============ IPFS Upload ============
  async uploadToIPFS(content: string | Uint8Array | Blob): Promise<string> {
    const result = await this.ipfsClient.add(content);
    console.log('Uploaded to IPFS with CID:', result.cid.toString());
    return result.cid.toString();
  }


  // ============ Fetch ABI ============
  async fetchABI(network: NetworkType, contractAddress: string): Promise<InterfaceAbi> {
    try {
      const apiUrl =
        network === NETWORK_TYPE.POLYGON
          ? 'https://api.polygonscan.com/api'
          : 'https://api.etherscan.io/api';

      const apiKey =
        network === NETWORK_TYPE.POLYGON
          ? process.env.POLYSCAN_API_KEY
          : process.env.ETHERSCAN_API_KEY;

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


  // ============ Get Contract Instance ============
  async fetchContract(network: NetworkType, contractAddress: string): Promise<Contract> {
    const abi = await this.fetchABI(network, contractAddress);

    if (!abi || !Array.isArray(abi)) {
      throw new Error('Invalid ABI: ABI is not an array.');
    }

    const signer = this.getSigner(network);
    return new Contract(contractAddress, abi, signer);
  }
}








// import { Injectable } from '@nestjs/common';
// import axios from "axios";
// import { Contract, ethers, HDNodeWallet, InterfaceAbi } from "ethers";
// import { NETWORK_TYPE, NetworkType } from 'src/core/app_types';


// @Injectable()
// export class ContractService {

//     private provider: ethers.JsonRpcProvider;
//     private signer: ethers.Wallet;
    
//     constructor() {

//         // Set up the provider
//         this.provider = new ethers.JsonRpcProvider(process.env.POLYGON_NODE_URL);
    
//         // Initialize signer from private key
//         this.signer = new ethers.Wallet(process.env.SYSTEM_WALLET_PRIVATE_KEY, this.provider);
//     }
    
    
//     async fetchABI(network: NetworkType, contractAddress: string,): Promise<InterfaceAbi> {
//         try {
            
//             let apiUrl: string;
//             let apiKey: string;

//             if (network === NETWORK_TYPE.POLYGON) {
//                 apiUrl = 'https://api.polygonscan.com/api';
//                 apiKey = process.env.POLYSCAN_API_KEY;
//             } else if (network === NETWORK_TYPE.ETHEREUM) {
//                 apiUrl = 'https://api.etherscan.io/api';
//                 apiKey = process.env.ETHERSCAN_API_KEY;
//             }

//             const res = await axios.get(apiUrl, {
//                 params: {
//                     module: 'contract',
//                     action: 'getabi',
//                     address: contractAddress,
//                     apikey: apiKey,
//                 },
//                 timeout: 60000,
//           });

//           const { data } = res;
      
//           if (data.status !== '1') {
//             throw new Error(`Failed to fetch ABI: ${data.result}`);
//           }
      
//           console.log('ABI fetched successfully');
//           return JSON.parse(data.result) as InterfaceAbi;
//         } catch (e) {
//           console.error('Error fetching ABI:', e.message);
//           throw e;
//         }
//     }
    


//     async fetchContract(network: NetworkType ,contractAddress: string): Promise<Contract> {
//         try {
    
//             // Fetch ABI
//             const abi = await this.fetchABI(network, contractAddress);
    
//             // check if there was an error
//             if (!abi || !Array.isArray(abi)) {
//                 throw new Error('Invalid ABI: ABI is not an array.');
//             }
    
//             // return the contract
//             return new Contract(
//               contractAddress,
//               abi,
//               this.signer,
//             );
    
//         } catch (e) {
//             console.error('Error initializing contract:', e.message);
//             throw e;
//         }
//     }


// }

