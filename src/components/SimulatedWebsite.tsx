"use client";

import { FakeWebsiteType } from "@/types";
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { DefaultSite } from '@/components/fakeWebsites';


interface SimulatedWebsiteProps {
    fakeWebsiteType: FakeWebsiteType;
    questionId: number;
    primaryButtonText?: string;
    onPrimaryButtonClick: () => void;
    buttonDisabled?: boolean;
}


export default function SimulatedWebsite({
    fakeWebsiteType,
    questionId,
    primaryButtonText = "Sign in with Ethereum",
    onPrimaryButtonClick,
    buttonDisabled = false
}: SimulatedWebsiteProps) {
    const WebsiteComponent = useMemo(() => {
        return dynamic<{
            questionId: number;
            primaryButtonText?: string;
            onPrimaryButtonClick: () => void;
            buttonDisabled?: boolean;
        }>(() => {
            switch (fakeWebsiteType.toLowerCase()) {
                case "opensea":
                    return import('@/components/fakeWebsites/OpenSea');
                case "uniswap":
                    return import('@/components/fakeWebsites/Uniswap');
                case "sendeth":
                    return import('@/components/fakeWebsites/SendEth');
                case "aave":
                    return import('@/components/fakeWebsites/Aave');
                case "safewallet":
                    return import('@/components/fakeWebsites/SafeWallet');
                case "securitycouncil":
                    return import('@/components/fakeWebsites/SecurityCouncil');
                default:
                    return import('@/components/fakeWebsites/DefaultSite');
            }
        }, {
            loading: () => <div><DefaultSite /></div>,
            ssr: false
        });
    }, [fakeWebsiteType]);

    return (
        <div>
            <WebsiteComponent
                questionId={questionId}
                primaryButtonText={primaryButtonText}
                onPrimaryButtonClick={onPrimaryButtonClick}
                buttonDisabled={buttonDisabled}
            />
        </div>
    );
}