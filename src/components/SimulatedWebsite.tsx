"use client";

import { FakeWebsiteType } from "@/types";
import dynamic from 'next/dynamic';
import { useMemo } from 'react';


interface SimulatedWebsiteProps {
    fakeWebsiteType: FakeWebsiteType;
    fakeWebsiteEdition: number;
    primaryButtonText?: string;
    onPrimaryButtonClick: () => void;
    buttonDisabled?: boolean;
}

export default function SimulatedWebsite({
    fakeWebsiteType,
    fakeWebsiteEdition,
    primaryButtonText = "Sign in with Ethereum",
    onPrimaryButtonClick,
    buttonDisabled = false
}: SimulatedWebsiteProps) {
    const WebsiteComponent = useMemo(() => {
        return dynamic<{
            fakeWebsiteEdition: number;
            primaryButtonText?: string;
            onPrimaryButtonClick: () => void;
            buttonDisabled?: boolean;
        }>(() => {
            switch (fakeWebsiteType.toLowerCase()) {
                case "opensea":
                    return import('@/components/fakeWebsites/OpenSea');
                case "uniswap":
                    return import('@/components/fakeWebsites/Uniswap');
                default:
                    return import('@/components/fakeWebsites/DefaultSite');
            }
        }, {
            loading: () => <div>Loading...</div>,
            ssr: false
        });
    }, [fakeWebsiteType]);

    return (
        <div>
            <WebsiteComponent
                fakeWebsiteEdition={fakeWebsiteEdition}
                primaryButtonText={primaryButtonText}
                onPrimaryButtonClick={onPrimaryButtonClick}
                buttonDisabled={buttonDisabled}
            />
        </div>
    );
}