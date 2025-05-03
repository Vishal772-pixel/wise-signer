"use client"

import { type ComponentPropsWithoutRef } from 'react';

// Helper function to preprocess markdown content
export const processMarkdownNewlines = (content: string): string => {
    if (!content) return '';

    // Replace groups of 2 or more newlines with special markers
    return content
        .replace(/\r\n/g, '\n')
        .replace(/\n{2,}/g, match => {
            // Insert non-breaking spaces with hard line breaks to preserve spacing
            return '\n\n' + Array(match.length - 1).fill('&nbsp;  ').join('\n') + '\n\n';
        });
};

const markdownComponents = {
    pre: (props: ComponentPropsWithoutRef<'pre'>) => (
        <pre
            className="max-w-full bg-gray-50 rounded-md p-3 my-4 overflow-hidden"
            style={{
                whiteSpace: 'pre-wrap',
                overflowWrap: 'anywhere'
            }}
            {...props}
        />
    ),
    code: ({ className, ...props }: ComponentPropsWithoutRef<'code'>) => {
        const isInline = !className?.includes('language-');
        return (
            <code
                className={isInline
                    ? "bg-gray-100 px-1 py-0.5 rounded text-sm font-mono"
                    : "font-mono text-sm"
                }
                style={!isInline ? {
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'anywhere',
                    display: 'block',
                    maxWidth: '100%'
                } : undefined}
                {...props}
            />
        );
    },
    // Enhanced paragraph component
    p: (props: ComponentPropsWithoutRef<'p'>) => {
        // Get the content as a string
        const content = props.children?.toString() || '';

        // Special handling for non-breaking space paragraphs
        // These were inserted by our preprocessing function
        if (content.trim() === '&nbsp;') {
            return <div className="h-4" aria-hidden="true" />;
        }

        return (
            <p
                className="max-w-full mb-4" // Add bottom margin for spacing
                style={{
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word'
                }}
                {...props}
            />
        );
    },
    // Add styling for links with target="_blank"
    a: (props: ComponentPropsWithoutRef<'a'>) => (
        <a
            className="text-blue-600 hover:text-blue-800 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
        />
    ),
    // Enhanced handling for breaks to ensure they create vertical space
    br: () => <div className="h-4" aria-hidden="true" />,

    // Handle consecutive newlines in text nodes
    text: (props: { children?: React.ReactNode }) => {
        const content = props.children?.toString() || '';

        // If we see our special marker, render appropriate spacing
        if (content.includes('&nbsp;')) {
            // Replace it with a proper space that will render correctly
            return <>{content.replace(/&nbsp;/g, ' ')}</>;
        }

        return <>{props.children}</>;
    }
};

export default markdownComponents;