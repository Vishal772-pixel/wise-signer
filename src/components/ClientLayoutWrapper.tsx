'use client';

import { ReactNode, useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { NetworkProvider } from '@/components/NetworkContext';
import '@rainbow-me/rainbowkit/styles.css';

interface ClientLayoutWrapperProps {
    children: ReactNode;
}

export default function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <>
                <div className="px-8 py-2 border-b border-zinc-800 flex flex-row justify-between items-center text-white bg-zinc-900">
                    {/* Static header placeholder */}
                    <div className="flex items-center gap-3">
                        <div className="w-[50px] h-[50px]" /> {/* Image placeholder */}
                        <span className="text-xl font-semibold">Wise Signer</span>
                    </div>
                </div>

                {children}

                <Footer />
            </>
        );
    }

    return (
        <NetworkProvider>
            <Header />
            {children}
            <Footer />
        </NetworkProvider>
    );
}