'use client'

import { getDefaultConfig, Chain } from '@rainbow-me/rainbowkit';
import { CUSTOM_CHAIN_ID, VIRTUAL_NET_NAME, ANVIL_URL } from './app/constants';

const wiseSignerNetwork = {
    id: CUSTOM_CHAIN_ID,
    name: VIRTUAL_NET_NAME,
    iconUrl: './wise-signer.png',
    iconBackground: '#fff',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: { http: [ANVIL_URL] },
    }
} as const satisfies Chain;

export default getDefaultConfig({
    appName: 'Wise Signer',
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    chains: [wiseSignerNetwork],
    ssr: false,
});