"use client";

import { FakeWebsiteType } from "@/types";
import React, { useState, useEffect, useRef, ComponentType } from 'react';

// Import DefaultSite directly for initial state and caching.
// Ensure DefaultSite is exported correctly from this path.
// If DefaultSite is a default export: import DefaultSiteComponent from '@/components/fakeWebsites/DefaultSite';
// If it's a named export: import { DefaultSite as DefaultSiteComponent } from '@/components/fakeWebsites';
// For this example, I'll assume DefaultSite is the component itself (e.g., a named export).
import { DefaultSite as DefaultSiteComponent } from '@/components/fakeWebsites';


// Define the props expected by all dynamically loaded website components
interface DynamicWebsiteProps {
    questionId: number;
    primaryButtonText?: string;
    onPrimaryButtonClick: () => void;
    buttonDisabled?: boolean;
}

// Cache for loaded components
const componentCache = new Map<string, ComponentType<DynamicWebsiteProps>>();

// Pre-populate cache with DefaultSite if it's not already there (it should be via import)
if (!componentCache.has('default')) {
    componentCache.set('default', DefaultSiteComponent);
}
if (!componentCache.has('defaultsite')) { // Handle potential variations in type name
    componentCache.set('defaultsite', DefaultSiteComponent);
}


// Helper function to load components
const loadWebsiteComponent = async (type: FakeWebsiteType): Promise<ComponentType<DynamicWebsiteProps>> => {
    const lowerType = type.toLowerCase();

    if (componentCache.has(lowerType)) {
        return componentCache.get(lowerType)!;
    }

    let importedModule;
    try {
        switch (lowerType) {
            case "opensea":
                importedModule = await import('@/components/fakeWebsites/OpenSea');
                break;
            case "uniswap":
                importedModule = await import('@/components/fakeWebsites/Uniswap');
                break;
            case "sendeth":
                importedModule = await import('@/components/fakeWebsites/SendEth');
                break;
            case "aave":
                importedModule = await import('@/components/fakeWebsites/Aave');
                break;
            case "aave2":
                importedModule = await import('@/components/fakeWebsites/Aave2');
                break;
            case "safewallet":
                importedModule = await import('@/components/fakeWebsites/SafeWallet');
                break;
            case "sendwethsafewallet":
                importedModule = await import('@/components/fakeWebsites/SendWethSafeWallet');
                break;
            case "securitycouncil":
                importedModule = await import('@/components/fakeWebsites/SecurityCouncil');
                break;
            case "sendtoken":
                importedModule = await import('@/components/fakeWebsites/SendToken');
                break;
            default: // Fallback to DefaultSite module
                importedModule = await import('@/components/fakeWebsites/DefaultSite');
                break;
        }
        // Assuming components are default exports from their files
        const component = importedModule.default;
        componentCache.set(lowerType, component);
        return component;
    } catch (error) {
        console.error(`Failed to load component ${lowerType}:`, error);
        // Fallback to the cached DefaultSiteComponent on error
        return DefaultSiteComponent;
    }
};

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

    // State to hold the currently rendered component. Initialize with DefaultSiteComponent.
    const [CurrentDisplayComponent, setCurrentDisplayComponent] =
        useState<ComponentType<DynamicWebsiteProps>>(() => DefaultSiteComponent);

    const [isTransitioning, setIsTransitioning] = useState(false);
    // Ref to track the type for which a component is currently being loaded or was last loaded.
    const loadingTypeRef = useRef<FakeWebsiteType | null>(null);


    useEffect(() => {
        // Check if we need to load a new component
        if (fakeWebsiteType !== loadingTypeRef.current) {
            // If CurrentDisplayComponent is not the one for fakeWebsiteType (or cache miss)
            // This means a new type is requested, or we are initializing with a specific type.

            const targetCachedComponent = componentCache.get(fakeWebsiteType.toLowerCase());
            if (targetCachedComponent && CurrentDisplayComponent === targetCachedComponent) {
                // Component already loaded and displayed, no transition needed.
                loadingTypeRef.current = fakeWebsiteType; // Update ref
                setIsTransitioning(false); // Ensure transition is off
                return;
            }


            setIsTransitioning(true);
            loadingTypeRef.current = fakeWebsiteType; // Mark that we are now loading for this type

            loadWebsiteComponent(fakeWebsiteType)
                .then(LoadedComponent => {
                    // Only update if the loaded component is still the one we want
                    // (user might have navigated again quickly)
                    if (loadingTypeRef.current === fakeWebsiteType) {
                        setCurrentDisplayComponent(() => LoadedComponent);
                    }
                })
                .catch(err => {
                    // Error is handled in loadWebsiteComponent to return DefaultSiteComponent
                    // but we still might want to ensure state is updated if a fallback occurred
                    if (loadingTypeRef.current === fakeWebsiteType) {
                        setCurrentDisplayComponent(() => DefaultSiteComponent); // Fallback
                    }
                    console.error("Error during component loading sequence:", err);
                })
                .finally(() => {
                    // Only stop transition if this is the latest request finishing
                    if (loadingTypeRef.current === fakeWebsiteType) {
                        setIsTransitioning(false);
                    }
                });
        }
    }, [fakeWebsiteType]); // Effect runs when fakeWebsiteType changes

    // Determine component to render. Default to DefaultSiteComponent if somehow CurrentDisplayComponent is null.
    const ComponentToRender = CurrentDisplayComponent || DefaultSiteComponent;

    return (
        // Apply a subtle opacity transition to indicate loading without a jarring content swap.
        // The key on the div ensures that if all props to ComponentToRender are identical
        // but ComponentToRender itself changes type, React handles the unmount/mount correctly.
        // However, changing the component type in state like this should be sufficient.
        <div
            key={fakeWebsiteType} // Add key to help React diff when component type changes programmatically
            style={{
                opacity: isTransitioning ? 0.6 : 1,
                transition: 'opacity 0.2s ease-in-out',
                minHeight: '300px' // Example: prevent layout shift if components have different initial heights
            }}
        >
            <ComponentToRender
                questionId={questionId}
                primaryButtonText={primaryButtonText}
                onPrimaryButtonClick={onPrimaryButtonClick}
                buttonDisabled={buttonDisabled}
            />
        </div>
    );
}