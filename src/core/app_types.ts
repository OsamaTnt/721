
export const NETWORK_TYPE = {
    POLYGON: 'polygon',
    ETHEREUM: 'ethereum',
} as const;
  

export type NetworkType = (typeof NETWORK_TYPE)[keyof typeof NETWORK_TYPE];

