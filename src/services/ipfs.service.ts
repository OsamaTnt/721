import { Injectable } from '@nestjs/common';
import { create as createIpfsClient, IPFSHTTPClient } from 'ipfs-http-client';



@Injectable()
export class IpfsService {


    private ipfsClient: IPFSHTTPClient;

    private projectId: String;
    private secretKey: String;


    constructor() {

        this.projectId = process.env.INFURA_PROJECT_ID;
        this.secretKey = process.env.INFURA_SECRECT_KEY;

        const auth =
            'Basic ' +
            Buffer.from(`${this.projectId}:${this.secretKey}`).toString('base64');


        this.ipfsClient = createIpfsClient({
            host: 'infura-ipfs.io',
            port: 5001,
            protocol: 'https',
            apiPath: `/api/v0`,
            headers: {
                authorization: auth,
            },
        });

    }



    // ============ IPFS Upload ============
    async uploadToIPFS(content: string | Uint8Array | Blob): Promise<string> {
        const result = await this.ipfsClient.add(content);
        console.log('Uploaded to IPFS with CID:', result.cid.toString());
        return result.cid.toString();
    }

    
    async uploadText(data: string) {
        const result = await this.ipfsClient.add(data);
        return result;
    }


}

